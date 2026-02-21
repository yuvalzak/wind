// IndexedDB storage for better iOS persistence
const DB_NAME = 'WindForecastDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';

let db = null;
let dbReady = false;

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      console.error('IndexedDB not supported');
      resolve(false);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('IndexedDB initialization failed');
      resolve(false);
    };
    
    request.onsuccess = (event) => {
      db = event.target.result;
      dbReady = true;
      console.log('IndexedDB initialized');
      resolve(true);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

// Get item from IndexedDB
async function getItem(key) {
  if (!dbReady || !db) {
    await initDB();
  }
  
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };
      
      request.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

// Set item in IndexedDB
async function setItem(key, value) {
  if (!dbReady || !db) {
    await initDB();
  }
  
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put({ key, value });
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

// Delete item from IndexedDB
async function deleteItem(key) {
  if (!dbReady || !db) {
    await initDB();
  }
  
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
      
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

// Synchronous fallback cache (in-memory) for immediate reads
const memCache = {};

// Migrate from localStorage to IndexedDB (one-time on first load)
async function migrateFromLocalStorage() {
  const migrated = await getItem('migrated_from_localStorage');
  if (migrated === 'true') return;
  
  console.log('Migrating localStorage → IndexedDB...');
  
  // Migrate all known keys
  const keys = [
    STORAGE_PLACES,
    STORAGE_LAST,
    STORAGE_LAST_FOLDER,
    STORAGE_FOLDER_COLLAPSED,
    STORAGE_SPOT_ORDER,
    'wind_calibration_v1',
    'folder_wave_calibration_v1',
    'spot_wave_calibration_v1'
  ];
  
  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        await setItem(key, value);
        memCache[key] = value;
      }
    } catch {}
  }
  
  await setItem('migrated_from_localStorage', 'true');
  console.log('Migration complete');
}

// Initialize DB on load
initDB().then(async () => {
  await migrateFromLocalStorage();
  
  // Load all data into memory cache on startup
  const keys = [
    STORAGE_PLACES,
    STORAGE_LAST,
    STORAGE_LAST_FOLDER,
    STORAGE_FOLDER_COLLAPSED,
    STORAGE_SPOT_ORDER,
    'wind_calibration_v1',
    'folder_wave_calibration_v1',
    'spot_wave_calibration_v1',
    'wind_folder_history_v1'
  ];
  for (const key of keys) {
    const value = await getItem(key);
    if (value !== null) {
      memCache[key] = value;
    }
  }

  // Rebuild folders UI now that calibration data is loaded from DB
  // (buildFoldersUI was called during init before this async load completed)
  if (typeof buildFoldersUI === 'function') {
    buildFoldersUI();
  }
});

// Data storage and management functions
function readPlacesRaw() {
  try {
    // Try memory cache first
    let raw = memCache[STORAGE_PLACES];
    
    // Fallback to localStorage if memCache not populated yet (during migration)
    if (!raw) {
      raw = localStorage.getItem(STORAGE_PLACES);
      if (raw) memCache[STORAGE_PLACES] = raw; // Cache it
    }
    
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    return arr;
  } catch {
    return null;
  }
}

function writePlacesRaw(arr) {
  const data = JSON.stringify(arr);
  memCache[STORAGE_PLACES] = data;
  
  // Write to localStorage immediately (sync)
  try {
    localStorage.setItem(STORAGE_PLACES, data);
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
  
  // Also write to IndexedDB (async)
  setItem(STORAGE_PLACES, data);
}

function ensureDefaultsSeeded() {
  const existing = readPlacesRaw();
  if (existing && existing.length) return;
  writePlacesRaw(DEFAULT_PLACES.map(p => ({ ...p })));
}

function normalizeGroupName(name) {
  const s = (name || '').toString().trim().slice(0, 24);
  return s || 'Ungrouped';
}

function getPlaces() {
  const raw = readPlacesRaw() || [];
  return raw
    .filter(p => p && typeof p.key === 'string' && typeof p.name === 'string' && typeof p.lat === 'number' && typeof p.lon === 'number')
    .map(p => ({
      key: p.key,
      name: (p.name || '').slice(0, 28),
      lat: p.lat,
      lon: p.lon,
      sea: (p.sea === 'med' || p.sea === 'lake' || p.sea === 'custom') ? p.sea : 'custom',
      applyBonus: !!p.applyBonus,
      group: normalizeGroupName(p.group)
    }));
}

function savePlaces(list) {
  writePlacesRaw(list.map(p => ({
    key: p.key,
    name: (p.name || '').slice(0, 28),
    lat: p.lat,
    lon: p.lon,
    sea: p.sea || 'custom',
    applyBonus: !!p.applyBonus,
    group: normalizeGroupName(p.group)
  })));
}

function deletePlace(key) {
  const places = getPlaces().filter(p => p.key !== key);
  savePlaces(places);
}

function setLastSelectedKey(key) {
  memCache[STORAGE_LAST] = key;
  try {
    localStorage.setItem(STORAGE_LAST, key);
  } catch {}
  setItem(STORAGE_LAST, key);
}

function getLastSelectedKey() {
  try {
    let value = memCache[STORAGE_LAST];
    if (!value) {
      value = localStorage.getItem(STORAGE_LAST);
      if (value) memCache[STORAGE_LAST] = value;
    }
    return value || '';
  } catch {
    return '';
  }
}

function setLastFolder(name) {
  memCache[STORAGE_LAST_FOLDER] = name;
  setItem(STORAGE_LAST_FOLDER, name);
}

function getLastFolder() {
  return memCache[STORAGE_LAST_FOLDER] || '';
}

function getFolderCollapsed() {
  try {
    const raw = memCache[STORAGE_FOLDER_COLLAPSED];
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setFolderCollapsed(folderName, isCollapsed) {
  try {
    const state = getFolderCollapsed();
    state[folderName] = isCollapsed;
    const data = JSON.stringify(state);
    memCache[STORAGE_FOLDER_COLLAPSED] = data;
    setItem(STORAGE_FOLDER_COLLAPSED, data);
  } catch {}
}

function getSpotOrder() {
  try {
    const raw = memCache[STORAGE_SPOT_ORDER];
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setSpotOrder(folderName, orderedKeys) {
  try {
    const orders = getSpotOrder();
    orders[folderName] = orderedKeys;
    const data = JSON.stringify(orders);
    memCache[STORAGE_SPOT_ORDER] = data;
    setItem(STORAGE_SPOT_ORDER, data);
  } catch {}
}

function getCalibrationRules(spotKey) {
  try {
    let raw = memCache['wind_calibration_v1'];
    if (!raw) {
      raw = localStorage.getItem('wind_calibration_v1');
      if (raw) memCache['wind_calibration_v1'] = raw;
    }
    const rules = raw ? JSON.parse(raw) : {};
    return rules[spotKey] || [];
  } catch {
    return [];
  }
}

function setCalibrationRules(spotKey, rules) {
  try {
    const all = memCache['wind_calibration_v1'];
    const allRules = all ? JSON.parse(all) : {};
    allRules[spotKey] = rules;
    const data = JSON.stringify(allRules);
    memCache['wind_calibration_v1'] = data;
    setItem('wind_calibration_v1', data);
  } catch {}
}

function getFolderWaveCalibration(folderName) {
  try {
    let raw = memCache['folder_wave_calibration_v1'];
    if (!raw) {
      raw = localStorage.getItem('folder_wave_calibration_v1');
      if (raw) memCache['folder_wave_calibration_v1'] = raw;
    }
    const calibrations = raw ? JSON.parse(raw) : {};
    return calibrations[folderName] || null;
  } catch {
    return null;
  }
}

function setFolderWaveCalibration(folderName, calibration) {
  try {
    const all = memCache['folder_wave_calibration_v1'];
    const calibrations = all ? JSON.parse(all) : {};
    if (calibration) {
      calibrations[folderName] = calibration;
    } else {
      delete calibrations[folderName];
    }
    const data = JSON.stringify(calibrations);
    memCache['folder_wave_calibration_v1'] = data;
    setItem('folder_wave_calibration_v1', data);
  } catch {}
}

function getSpotWaveCalibration(spotKey) {
  try {
    let raw = memCache['spot_wave_calibration_v1'];
    if (!raw) {
      raw = localStorage.getItem('spot_wave_calibration_v1');
      if (raw) memCache['spot_wave_calibration_v1'] = raw;
    }
    const calibrations = raw ? JSON.parse(raw) : {};
    return calibrations[spotKey] || null;
  } catch {
    return null;
  }
}

function setSpotWaveCalibration(spotKey, calibration) {
  try {
    const all = memCache['spot_wave_calibration_v1'];
    const calibrations = all ? JSON.parse(all) : {};
    if (calibration) {
      calibrations[spotKey] = calibration;
    } else {
      delete calibrations[spotKey];
    }
    const data = JSON.stringify(calibrations);
    memCache['spot_wave_calibration_v1'] = data;
    setItem('spot_wave_calibration_v1', data);
  } catch {}
}

function getAllGroups() {
  const groups = new Set();
  for (const p of getPlaces()) {
    groups.add(normalizeGroupName(p.group));
  }
  groups.add('Ungrouped');
  return Array.from(groups).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

function sortPlaces(list) {
  const rankSea = (sea) => (sea === 'med' ? 0 : (sea === 'lake' ? 1 : 2));
  return [...list].sort((a, b) => {
    const ga = normalizeGroupName(a.group).toLowerCase();
    const gb = normalizeGroupName(b.group).toLowerCase();
    if (ga !== gb) return ga.localeCompare(gb);

    const ra = rankSea(a.sea), rb = rankSea(b.sea);
    if (ra !== rb) return ra - rb;

    if (a.sea === 'med' && b.sea === 'med') {
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
const STORAGE_FOLDER_HISTORY = 'wind_folder_history_v1';

function getFolderHistory() {
  try {
    const raw = memCache[STORAGE_FOLDER_HISTORY] || localStorage.getItem(STORAGE_FOLDER_HISTORY);
    if (raw) memCache[STORAGE_FOLDER_HISTORY] = raw;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFolderHistory(history) {
  const data = JSON.stringify(history);
  memCache[STORAGE_FOLDER_HISTORY] = data;
  try { localStorage.setItem(STORAGE_FOLDER_HISTORY, data); } catch {}
  setItem(STORAGE_FOLDER_HISTORY, data);
}

function archiveFolderToHistory(folderName) {
  const places = getPlaces();
  const toArchive = places.filter(p => normalizeGroupName(p.group) === folderName);
  if (toArchive.length === 0) return;

  const archivedSpots = toArchive.map(p => ({
    ...p,
    _windRules: getCalibrationRules(p.key),
    _spotWaveCal: getSpotWaveCalibration(p.key)
  }));

  const history = getFolderHistory();
  history.unshift({
    id: 'hist_' + Date.now().toString(16),
    folderName,
    archivedAt: new Date().toISOString(),
    spots: archivedSpots,
    folderWaveCal: getFolderWaveCalibration(folderName)
  });
  saveFolderHistory(history.slice(0, 20));

  const remaining = places.filter(p => normalizeGroupName(p.group) !== folderName);
  savePlaces(remaining);
}

function restoreFolderFromHistory(historyId) {
  const history = getFolderHistory();
  const entry = history.find(h => h.id === historyId);
  if (!entry) return 0;

  const places = getPlaces();
  let addedCount = 0;

  for (const sp of entry.spots) {
    const exists = places.some(p => Math.abs(p.lat - sp.lat) < 0.001 && Math.abs(p.lon - sp.lon) < 0.001);
    if (!exists) {
      const { _windRules, _spotWaveCal, ...cleanSpot } = sp;
      cleanSpot.key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
      places.push(cleanSpot);
      if (_windRules && _windRules.length) setCalibrationRules(cleanSpot.key, _windRules);
      if (_spotWaveCal) setSpotWaveCalibration(cleanSpot.key, _spotWaveCal);
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
  const history = getFolderHistory();
  const entry = history.find(h => h.id === historyId);
  if (!entry) return 0;

  const places = getPlaces();
  let addedCount = 0;

  for (const sp of entry.spots) {
    if (!spotKeys.includes(sp.key)) continue;
    const exists = places.some(p => Math.abs(p.lat - sp.lat) < 0.001 && Math.abs(p.lon - sp.lon) < 0.001);
    if (!exists) {
      const { _windRules, _spotWaveCal, ...cleanSpot } = sp;
      cleanSpot.key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
      places.push(cleanSpot);
      if (_windRules && _windRules.length) setCalibrationRules(cleanSpot.key, _windRules);
      if (_spotWaveCal) setSpotWaveCalibration(cleanSpot.key, _spotWaveCal);
      addedCount++;
    }
  }

  if (addedCount > 0) savePlaces(places);
  return addedCount;
}

function deleteHistoryEntry(historyId) {
  saveFolderHistory(getFolderHistory().filter(h => h.id !== historyId));
}
