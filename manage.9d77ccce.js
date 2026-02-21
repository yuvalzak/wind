// Manage panel and spot controls
const selTitleEl = document.getElementById('sel_title');
const selSubEl = document.getElementById('sel_sub');
const deleteSelBtn = document.getElementById('deleteSelBtn');
const editLocationBtn = document.getElementById('editLocationBtn');

function refreshSelectedPanel() {
  const loc = PLACES[currentIndex];
  if (!loc) {
    selTitleEl.textContent = '—';
    selSubEl.textContent = '—';
    deleteSelBtn.disabled = true;
    editLocationBtn.style.display = 'none';
    return;
  }
  selTitleEl.textContent = loc.name;
  selSubEl.textContent = `📁 ${normalizeGroupName(loc.group)}`;
  editLocationBtn.style.display = 'flex';

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
