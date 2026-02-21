// Data storage and management functions
function readPlacesRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_PLACES);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    return arr;
  } catch {
    return null;
  }
}

function writePlacesRaw(arr) {
  localStorage.setItem(STORAGE_PLACES, JSON.stringify(arr));
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
  try {
    localStorage.setItem(STORAGE_LAST, key);
  } catch {}
}

function getLastSelectedKey() {
  try {
    return localStorage.getItem(STORAGE_LAST) || '';
  } catch {
    return '';
  }
}

function setLastFolder(name) {
  try {
    localStorage.setItem(STORAGE_LAST_FOLDER, name);
  } catch {}
}

function getLastFolder() {
  try {
    return localStorage.getItem(STORAGE_LAST_FOLDER) || '';
  } catch {
    return '';
  }
}

function getFolderCollapsed() {
  try {
    const raw = localStorage.getItem(STORAGE_FOLDER_COLLAPSED);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setFolderCollapsed(folderName, isCollapsed) {
  try {
    const state = getFolderCollapsed();
    state[folderName] = isCollapsed;
    localStorage.setItem(STORAGE_FOLDER_COLLAPSED, JSON.stringify(state));
  } catch {}
}

function getSpotOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_SPOT_ORDER);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setSpotOrder(folderName, orderedKeys) {
  try {
    const orders = getSpotOrder();
    orders[folderName] = orderedKeys;
    localStorage.setItem(STORAGE_SPOT_ORDER, JSON.stringify(orders));
  } catch {}
}

function getCalibrationRules(spotKey) {
  try {
    const all = localStorage.getItem('wind_calibration_v1');
    const rules = all ? JSON.parse(all) : {};
    return rules[spotKey] || [];
  } catch {
    return [];
  }
}

function setCalibrationRules(spotKey, rules) {
  try {
    const all = localStorage.getItem('wind_calibration_v1');
    const allRules = all ? JSON.parse(all) : {};
    allRules[spotKey] = rules;
    localStorage.setItem('wind_calibration_v1', JSON.stringify(allRules));
  } catch {}
}

function getFolderWaveCalibration(folderName) {
  try {
    const all = localStorage.getItem('folder_wave_calibration_v1');
    const calibrations = all ? JSON.parse(all) : {};
    return calibrations[folderName] || null;
  } catch {
    return null;
  }
}

function setFolderWaveCalibration(folderName, calibration) {
  try {
    const all = localStorage.getItem('folder_wave_calibration_v1');
    const calibrations = all ? JSON.parse(all) : {};
    if (calibration) {
      calibrations[folderName] = calibration;
    } else {
      delete calibrations[folderName];
    }
    localStorage.setItem('folder_wave_calibration_v1', JSON.stringify(calibrations));
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
