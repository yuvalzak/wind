// Manage panel and spot controls
const selTitleEl = document.getElementById('sel_title');
const selSubEl = document.getElementById('sel_sub');
const selGroupEl = document.getElementById('sel_group');
const deleteSelBtn = document.getElementById('deleteSelBtn');
const editLocationBtn = document.getElementById('editLocationBtn');

function refreshSelectedPanel() {
  const loc = PLACES[currentIndex];
  if (!loc) {
    selTitleEl.textContent = '—';
    selSubEl.textContent = '—';
    selGroupEl.innerHTML = '';
    deleteSelBtn.disabled = true;
    editLocationBtn.style.display = 'none';
    return;
  }
  selTitleEl.textContent = loc.name;
  selSubEl.textContent = `📁 ${normalizeGroupName(loc.group)}`;
  editLocationBtn.style.display = 'flex';

  const groups = getAllGroups();
  selGroupEl.innerHTML = '';
  for (const g of groups) {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    selGroupEl.appendChild(opt);
  }
  const optNew = document.createElement('option');
  optNew.value = '__new__';
  optNew.textContent = '➕ New folder…';
  selGroupEl.appendChild(optNew);

  selGroupEl.value = groups.includes(normalizeGroupName(loc.group)) ? normalizeGroupName(loc.group) : 'Ungrouped';
  deleteSelBtn.disabled = false;
}

// Open map modal in edit mode for current spot
editLocationBtn.addEventListener('click', () => {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  
  // Set the global flag to indicate we're editing
  window.isEditingSpot = true;
  window.editingSpotKey = loc.key;
  
  openMap();
});

selGroupEl.addEventListener('change', () => {
  const loc = PLACES[currentIndex];
  if (!loc) return;

  let g = selGroupEl.value;
  if (g === '__new__') {
    const name = prompt('Folder name (e.g. Greece):', 'Greece');
    if (!name) {
      refreshSelectedPanel();
      return;
    }
    g = normalizeGroupName(name);
  }
  movePlaceToGroup(loc.key, g);
});

deleteSelBtn.addEventListener('click', () => {
  const loc = PLACES[currentIndex];
  if (!loc) return;

  const ok = confirm(`Delete "${loc.name}"?\n\nThe spot will be moved to History — you can restore it later from Settings → History.`);
  if (!ok) return;

  deletePlace(loc.key);
  reloadPlacesKeepSelection();
  buildFoldersUI();
  setHeader();
  refreshSelectedPanel();
  loadForecastForSelected();
  refreshRealtimeForAllButtons();
});
