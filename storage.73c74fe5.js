// ─────────────────────────────────────────────────────────────────────────────
// Storage strategy
//   • localStorage  → primary store, synchronous, instant reads on page load
//   • IndexedDB     → silent background backup only
//                     written on every save so data survives a localStorage clear
//                     read ONLY when localStorage is empty/cleared (recovery)
// ─────────────────────────────────────────────────────────────────────────────

// ── Storage keys ─────────────────────────────────────────────────────────────
// STORAGE_PLACES, STORAGE_LAST, STORAGE_LAST_FOLDER, STORAGE_FOLDER_COLLAPSED,
// STORAGE_SPOT_ORDER are declared in config.js — do not re-declare here
const STORAGE_FOLDER_HISTORY   = 'wind_folder_history_v1';

// All keys that live in localStorage
const LS_KEYS = [
  STORAGE_PLACES,
  STORAGE_LAST,
  STORAGE_LAST_FOLDER,
  STORAGE_FOLDER_COLLAPSED,
  STORAGE_SPOT_ORDER,
  STORAGE_FOLDER_HISTORY,
  'wind_calibration_v1',
  'folder_wave_calibration_v1',
  'spot_wave_calibration_v1',
];

// ── Tiny localStorage helpers ─────────────────────────────────────────────────
function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// ── IndexedDB — backup only ───────────────────────────────────────────────────
const DB_NAME    = 'WindForecastDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';
let _db = null;

function _openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve) => {
    if (!window.indexedDB) { resolve(null); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror       = () => resolve(null);
    req.onsuccess     = (e) => { _db = e.target.result; resolve(_db); };
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

// Fire-and-forget write to IndexedDB — callers never await this
function idbSet(key, value) {
  _openDB().then(db => {
    if (!db) return;
    try {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      tx.objectStore(STORE_NAME).put({ key, value });
    } catch {}
  });
}

// Read from IndexedDB — used only during recovery
function idbGet(key) {
  return _openDB().then(db => {
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx  = db.transaction([STORE_NAME], 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result?.value ?? null);
        req.onerror   = () => resolve(null);
      } catch { resolve(null); }
    });
  });
}

// ── Backup snapshot (debounced) ───────────────────────────────────────────────
let _backupTimer = null;
function scheduleBackup() {
  clearTimeout(_backupTimer);
  _backupTimer = setTimeout(() => {
    const snap = {};
    for (const key of LS_KEYS) {
      const v = lsGet(key);
      if (v) snap[key] = v;
    }
    idbSet('backup_snapshot', JSON.stringify(snap));
  }, 2000);
}

// ── Recovery: restore localStorage from IndexedDB if it was cleared ───────────
async function recoverFromBackupIfNeeded() {
  if (lsGet(STORAGE_PLACES)) return; // localStorage is fine, nothing to do

  const backup = await idbGet('backup_snapshot');
  if (!backup) return;

  try {
    const snap = JSON.parse(backup);
    for (const [key, value] of Object.entries(snap)) {
      if (value) lsSet(key, value);
    }
    console.log('Restored data from IndexedDB backup after localStorage was cleared');
    if (typeof reloadPlacesKeepSelection === 'function') reloadPlacesKeepSelection();
    if (typeof buildFoldersUI           === 'function') buildFoldersUI();
    if (typeof refreshSelectedPanel     === 'function') refreshSelectedPanel();
  } catch (e) {
    console.warn('Recovery from backup failed:', e);
  }
}

// Run recovery check on startup (async, non-blocking)
recoverFromBackupIfNeeded();

// ─────────────────────────────────────────────────────────────────────────────
// Data API — fully synchronous, localStorage only
// ─────────────────────────────────────────────────────────────────────────────

function normalizeGroupName(name) {
  const s = (name || '').toString().trim().slice(0, 24);
  return s || 'Ungrouped';
}

// ── Places ────────────────────────────────────────────────────────────────────
function readPlacesRaw() {
  try {
    const raw = lsGet(STORAGE_PLACES);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch { return null; }
}

function writePlacesRaw(arr) {
  lsSet(STORAGE_PLACES, JSON.stringify(arr));
  scheduleBackup();
}

function ensureDefaultsSeeded() {
  const existing = readPlacesRaw();
  if (existing && existing.length) return;
  writePlacesRaw(DEFAULT_PLACES.map(p => ({ ...p })));
}

function getPlaces() {
  const raw = readPlacesRaw() || [];
  return raw
    .filter(p => p && typeof p.key === 'string' && typeof p.name === 'string'
              && typeof p.lat === 'number' && typeof p.lon === 'number')
    .map(p => ({
      key:        p.key,
      name:       (p.name || '').slice(0, 28),
      lat:        p.lat,
      lon:        p.lon,
      sea:        (p.sea === 'med' || p.sea === 'lake' || p.sea === 'custom') ? p.sea : 'custom',
      applyBonus: !!p.applyBonus,
      group:      normalizeGroupName(p.group),
    }));
}

function savePlaces(list) {
  writePlacesRaw(list.map(p => ({
    key:        p.key,
    name:       (p.name || '').slice(0, 28),
    lat:        p.lat,
    lon:        p.lon,
    sea:        p.sea || 'custom',
    applyBonus: !!p.applyBonus,
    group:      normalizeGroupName(p.group),
  })));
}

function deletePlace(key) {
  savePlaces(getPlaces().filter(p => p.key !== key));
}

// ── Last selected key ─────────────────────────────────────────────────────────
function setLastSelectedKey(key) { lsSet(STORAGE_LAST, key); }
function getLastSelectedKey()    { return lsGet(STORAGE_LAST) || ''; }

// ── Last folder ───────────────────────────────────────────────────────────────
function setLastFolder(name) { lsSet(STORAGE_LAST_FOLDER, name); }
function getLastFolder()     { return lsGet(STORAGE_LAST_FOLDER) || ''; }

// ── Folder collapsed state ────────────────────────────────────────────────────
function getFolderCollapsed() {
  try { return JSON.parse(lsGet(STORAGE_FOLDER_COLLAPSED) || '{}'); } catch { return {}; }
}
function setFolderCollapsed(folderName, isCollapsed) {
  try {
    const state = getFolderCollapsed();
    state[folderName] = isCollapsed;
    lsSet(STORAGE_FOLDER_COLLAPSED, JSON.stringify(state));
  } catch {}
}

// ── Spot order ────────────────────────────────────────────────────────────────
function getSpotOrder() {
  try { return JSON.parse(lsGet(STORAGE_SPOT_ORDER) || '{}'); } catch { return {}; }
}
function setSpotOrder(folderName, orderedKeys) {
  try {
    const orders = getSpotOrder();
    orders[folderName] = orderedKeys;
    lsSet(STORAGE_SPOT_ORDER, JSON.stringify(orders));
  } catch {}
}

// ── Wind calibration rules ────────────────────────────────────────────────────
function getCalibrationRules(spotKey) {
  try {
    const all = JSON.parse(lsGet('wind_calibration_v1') || '{}');
    return all[spotKey] || [];
  } catch { return []; }
}
function setCalibrationRules(spotKey, rules) {
  try {
    const all = JSON.parse(lsGet('wind_calibration_v1') || '{}');
    all[spotKey] = rules;
    lsSet('wind_calibration_v1', JSON.stringify(all));
    scheduleBackup();
  } catch {}
}

// ── Folder wave calibration ───────────────────────────────────────────────────
function getFolderWaveCalibration(folderName) {
  try {
    const all = JSON.parse(lsGet('folder_wave_calibration_v1') || '{}');
    return all[folderName] || null;
  } catch { return null; }
}
function setFolderWaveCalibration(folderName, calibration) {
  try {
    const all = JSON.parse(lsGet('folder_wave_calibration_v1') || '{}');
    if (calibration) { all[folderName] = calibration; }
    else             { delete all[folderName]; }
    lsSet('folder_wave_calibration_v1', JSON.stringify(all));
    scheduleBackup();
  } catch {}
}

// ── Spot wave calibration ─────────────────────────────────────────────────────
function getSpotWaveCalibration(spotKey) {
  try {
    const all = JSON.parse(lsGet('spot_wave_calibration_v1') || '{}');
    return all[spotKey] || null;
  } catch { return null; }
}
function setSpotWaveCalibration(spotKey, calibration) {
  try {
    const all = JSON.parse(lsGet('spot_wave_calibration_v1') || '{}');
    if (calibration) { all[spotKey] = calibration; }
    else             { delete all[spotKey]; }
    lsSet('spot_wave_calibration_v1', JSON.stringify(all));
    scheduleBackup();
  } catch {}
}

// ── Groups / sorting ──────────────────────────────────────────────────────────
function getAllGroups() {
  const groups = new Set();
  for (const p of getPlaces()) groups.add(normalizeGroupName(p.group));
  groups.add('Ungrouped');
  return Array.from(groups).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function sortPlaces(list) {
  const rankSea = (sea) => (sea === 'med' ? 0 : sea === 'lake' ? 1 : 2);
  return [...list].sort((a, b) => {
    const ga = normalizeGroupName(a.group).toLowerCase();
    const gb = normalizeGroupName(b.group).toLowerCase();
    if (ga !== gb) return ga.localeCompare(gb);
    const ra = rankSea(a.sea), rb = rankSea(b.sea);
    if (ra !== rb) return ra - rb;
    if (a.sea === 'med'  && b.sea === 'med')  {
      if (b.lat !== a.lat) return b.lat - a.lat;
      return a.name.localeCompare(b.name);
    }
    if (a.sea === 'lake' && b.sea === 'lake') {
      if (b.lat !== a.lat) return b.lat - a.lat;
      return a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });
}

// ── Folder History ────────────────────────────────────────────────────────────
function getFolderHistory() {
  try { return JSON.parse(lsGet(STORAGE_FOLDER_HISTORY) || '[]'); } catch { return []; }
}

function saveFolderHistory(history) {
  const data = JSON.stringify(history);
  lsSet(STORAGE_FOLDER_HISTORY, data);
  // History also gets its own dedicated IndexedDB slot for extra durability
  idbSet(STORAGE_FOLDER_HISTORY, data);
  scheduleBackup();
}

function archiveFolderToHistory(folderName) {
  const places    = getPlaces();
  const toArchive = places.filter(p => normalizeGroupName(p.group) === folderName);
  if (toArchive.length === 0) return;

  const archivedSpots = toArchive.map(p => ({
    ...p,
    _windRules:    getCalibrationRules(p.key),
    _spotWaveCal:  getSpotWaveCalibration(p.key),
  }));

  const history = getFolderHistory();
  history.unshift({
    id:            'hist_' + Date.now().toString(16),
    folderName,
    archivedAt:    new Date().toISOString(),
    spots:         archivedSpots,
    folderWaveCal: getFolderWaveCalibration(folderName),
  });
  saveFolderHistory(history.slice(0, 20));

  savePlaces(places.filter(p => normalizeGroupName(p.group) !== folderName));
}

function restoreFolderFromHistory(historyId) {
  const entry = getFolderHistory().find(h => h.id === historyId);
  if (!entry) return 0;

  const places = getPlaces();
  let addedCount = 0;

  for (const sp of entry.spots) {
    const exists = places.some(p =>
      Math.abs(p.lat - sp.lat) < 0.001 && Math.abs(p.lon - sp.lon) < 0.001
    );
    if (!exists) {
      const { _windRules, _spotWaveCal, ...cleanSpot } = sp;
      cleanSpot.key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
      places.push(cleanSpot);
      if (_windRules   && _windRules.length) setCalibrationRules(cleanSpot.key, _windRules);
      if (_spotWaveCal)                      setSpotWaveCalibration(cleanSpot.key, _spotWaveCal);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    savePlaces(places);
    if (entry.folderWaveCal) setFolderWaveCalibration(entry.folderName, entry.folderWaveCal);
  }
  return addedCount;
}

function restoreSpotsFromHistory(historyId, spotKeys) {
  const entry = getFolderHistory().find(h => h.id === historyId);
  if (!entry) return 0;

  const places = getPlaces();
  let addedCount = 0;

  for (const sp of entry.spots) {
    if (!spotKeys.includes(sp.key)) continue;
    const exists = places.some(p =>
      Math.abs(p.lat - sp.lat) < 0.001 && Math.abs(p.lon - sp.lon) < 0.001
    );
    if (!exists) {
      const { _windRules, _spotWaveCal, ...cleanSpot } = sp;
      cleanSpot.key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
      places.push(cleanSpot);
      if (_windRules   && _windRules.length) setCalibrationRules(cleanSpot.key, _windRules);
      if (_spotWaveCal)                      setSpotWaveCalibration(cleanSpot.key, _spotWaveCal);
      addedCount++;
    }
  }

  if (addedCount > 0) savePlaces(places);
  return addedCount;
}

function deleteHistoryEntry(historyId) {
  saveFolderHistory(getFolderHistory().filter(h => h.id !== historyId));
}

// ── My Day preferences ────────────────────────────────────────────────────────
const STORAGE_MYDAY = 'wind_myday_prefs_v1';

function getMyDayPrefs() {
  try { return JSON.parse(lsGet(STORAGE_MYDAY) || 'null'); } catch { return null; }
}

function saveMyDayPrefs(prefs) {
  lsSet(STORAGE_MYDAY, JSON.stringify(prefs));
  scheduleBackup();
}

function clearMyDayPrefs() {
  lsSet(STORAGE_MYDAY, null);
}

// Check if a single hour's data point matches the My Day rules.
// Returns true if ALL active rules pass.
function hourMatchesMyDay(prefs, { speed, gust, waveH, waveP }) {
  if (!prefs) return false;

  function check(op, min, max, val) {
    if (op === 'any') return true;
    if (val === null || val === undefined) return true; // no data → don't disqualify
    if (op === 'gt')      return val >= min;
    if (op === 'lt')      return val <= min;
    if (op === 'between') return val >= min && val <= max;
    return true;
  }

  return (
    check(prefs.wind_op,  prefs.wind_min,  prefs.wind_max,  speed) &&
    check(prefs.gust_op,  prefs.gust_min,  prefs.gust_max,  gust)  &&
    check(prefs.waveH_op, prefs.waveH_min, prefs.waveH_max, waveH) &&
    check(prefs.waveP_op, prefs.waveP_min, prefs.waveP_max, waveP)
  );
}

// Given a day's array of hour objects, is it a "good day"?
// Good = all daytime hours (9am–6pm) that have wind data pass the rules.
function isDayGood(prefs, dayData) {
  if (!prefs) return false;
  const dayHours = dayData.filter(h => {
    const hr = h.time.getHours();
    return hr >= 9 && hr <= 18;
  });
  if (dayHours.length === 0) return false;
  return dayHours.every(h => hourMatchesMyDay(prefs, h));
}
