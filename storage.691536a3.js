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

// Initialize DB on load
initDB().then(async () => {
  // Load critical data into memory cache on startup
  const keys = [STORAGE_PLACES, STORAGE_LAST, STORAGE_LAST_FOLDER];
  for (const key of keys) {
    const value = await getItem(key);
    if (value !== null) {
      memCache[key] = value;
    }
  }
});

// Data storage and management functions
function readPlacesRaw() {
  try {
    const raw = memCache[STORAGE_PLACES];
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
  setItem(STORAGE_PLACES, data); // Async write to IndexedDB
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
  setItem(STORAGE_LAST, key);
}

function getLastSelectedKey() {
  return memCache[STORAGE_LAST] || '';
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
    const all = memCache['wind_calibration_v1'];
    const rules = all ? JSON.parse(all) : {};
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
    const all = memCache['folder_wave_calibration_v1'];
    const calibrations = all ? JSON.parse(all) : {};
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
    const all = memCache['spot_wave_calibration_v1'];
    const calibrations = all ? JSON.parse(all) : {};
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
