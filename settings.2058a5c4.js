// Settings modal functionality
const settingsBackdrop = document.getElementById('settingsBackdrop');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsContents = document.querySelectorAll('.settings-content');

function openSettings(tabName = 'help') {
  settingsBackdrop.style.display = 'flex';
  settingsBackdrop.setAttribute('aria-hidden', 'false');
  
  // Switch to the specified tab
  switchSettingsTab(tabName);
  
  // If opening folders tab, populate folder list
  if (tabName === 'folders') {
    populateFolderRenameList();
    populateFolderWaveCalibrationList();
  }
  
  // If opening history tab, populate history list
  if (tabName === 'history') {
    populateFolderHistoryList();
  }
  
  // If opening best spots tab, render the spots list
  if (tabName === 'bestspots') {
    renderBestSpotsList();
  }
}

function closeSettings() {
  settingsBackdrop.style.display = 'none';
  settingsBackdrop.setAttribute('aria-hidden', 'true');
}

function switchSettingsTab(tabName) {
  // Update tab buttons
  settingsTabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update content panels
  settingsContents.forEach(content => {
    if (content.id === `settings-${tabName}`) {
      content.classList.add('active');
      content.style.display = 'block';
    } else {
      content.classList.remove('active');
      content.style.display = 'none';
    }
  });
}

function populateFolderRenameList() {
  const folderRenameList = document.getElementById('folderRenameList');
  const groups = getAllGroups();
  
  folderRenameList.innerHTML = '';
  
  if (groups.length === 0 || (groups.length === 1 && groups[0] === 'Ungrouped')) {
    folderRenameList.innerHTML = '<p style="color: #6c7a89;">No folders to rename. Create folders by adding spots with the "Pick on map" button.</p>';
    return;
  }
  
  for (const group of groups) {
    if (group === 'Ungrouped') continue; // Don't allow renaming Ungrouped
    
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder-rename-item';
    folderDiv.draggable = true;
    folderDiv.dataset.folder = group;
    folderDiv.style.cssText = 'display: flex; gap: 10px; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; cursor: move; flex-wrap: wrap;';
    
    const dragHandle = document.createElement('span');
    dragHandle.textContent = '⋮⋮';
    dragHandle.style.cssText = 'color: #95a5a6; font-size: 1.2em; cursor: move; user-select: none;';
    
    const currentName = document.createElement('span');
    currentName.style.cssText = 'font-weight: 700; color: #2c3e50; min-width: 100px; flex: 0 1 auto;';
    currentName.textContent = group;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.placeholder = 'New folder name';
    input.value = group;
    input.style.cssText = 'flex: 1 1 150px; min-width: 120px;';
    
    const renameBtn = document.createElement('button');
    renameBtn.type = 'button';
    renameBtn.className = 'save';
    renameBtn.textContent = 'Rename';
    renameBtn.style.cssText = 'padding: 10px 20px; flex: 0 0 auto;';
    renameBtn.onclick = () => renameFolder(group, input.value.trim());
    
    folderDiv.appendChild(dragHandle);
    folderDiv.appendChild(currentName);
    folderDiv.appendChild(input);
    folderDiv.appendChild(renameBtn);
    folderRenameList.appendChild(folderDiv);
    
    // Drag and drop event handlers
    folderDiv.addEventListener('dragstart', handleDragStart);
    folderDiv.addEventListener('dragover', handleDragOver);
    folderDiv.addEventListener('drop', handleDrop);
    folderDiv.addEventListener('dragend', handleDragEnd);
  }
}

// Drag and drop handlers for folder sorting
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = this;
  this.style.opacity = '0.4';
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  
  if (this === draggedElement) return;
  
  const items = Array.from(document.querySelectorAll('.folder-rename-item'));
  const draggedIndex = items.indexOf(draggedElement);
  const targetIndex = items.indexOf(this);
  
  if (draggedIndex < targetIndex) {
    this.parentNode.insertBefore(draggedElement, this.nextSibling);
  } else {
    this.parentNode.insertBefore(draggedElement, this);
  }
  
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  
  // Save the new folder order
  const items = Array.from(document.querySelectorAll('.folder-rename-item'));
  const newOrder = items.map(item => item.dataset.folder);
  
  // Store folder order in localStorage
  try {
    localStorage.setItem('wind_folder_order_v1', JSON.stringify(newOrder));
  } catch (e) {
    console.error('Failed to save folder order', e);
  }
  
  // Rebuild folders UI with new order
  buildFoldersUI();
}

function renameFolder(oldName, newName) {
  if (!newName || newName === oldName) {
    return; // Just do nothing silently
  }
  
  const normalized = normalizeGroupName(newName);
  
  if (normalized === 'Ungrouped') {
    return; // Can't rename to Ungrouped, just ignore
  }
  
  // Check if new name already exists
  const groups = getAllGroups();
  if (groups.includes(normalized) && normalized !== oldName) {
    return; // Name exists, just ignore
  }
  
  // Rename all spots in this folder
  const places = getPlaces();
  let updatedCount = 0;
  
  for (const place of places) {
    if (normalizeGroupName(place.group) === oldName) {
      place.group = normalized;
      updatedCount++;
    }
  }
  
  if (updatedCount > 0) {
    savePlaces(places);
    reloadPlacesKeepSelection();
    buildFoldersUI();
    populateFolderRenameList(); // Refresh the list
  }
}

function populateFolderWaveCalibrationList() {
  const container = document.getElementById('folderWaveCalibrationList');
  const groups = getAllGroups().filter(g => g !== 'Ungrouped');
  
  container.innerHTML = '';
  
  if (groups.length === 0) {
    container.innerHTML = '<p style="color: #6c7a89;">No folders available. Create folders by adding spots.</p>';
    return;
  }
  
  for (const group of groups) {
    const calibration = getFolderWaveCalibration(group);
    const spotsInFolder = getPlaces().filter(p => normalizeGroupName(p.group) === group).length;
    
    const card = document.createElement('div');
    card.style.cssText = `padding: 16px; background: #f8f9fa; border-radius: 12px; border: 2px solid ${calibration ? '#16a085' : '#ecf0f1'};`;
    
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';
    
    const title = document.createElement('div');
    title.style.cssText = 'font-weight: 700; color: #2c3e50; font-size: 1.1em;';
    title.textContent = `📁 ${group}`;
    
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display: flex; align-items: center; gap: 8px;';

    const spotCount = document.createElement('div');
    spotCount.style.cssText = 'color: #6c7a89; font-size: 0.9em;';
    spotCount.textContent = `${spotsInFolder} spot${spotsInFolder !== 1 ? 's' : ''}`;

    rightSide.appendChild(spotCount);

    // Show active calibration summary badge
    if (calibration) {
      const activeBadge = document.createElement('div');
      activeBadge.style.cssText = 'background: #16a085; color: white; padding: 3px 8px; border-radius: 8px; font-size: 0.78em; font-weight: 700;';
      const smallDesc = calibration.smallWaveType === 'percent'
        ? `${calibration.smallWaveValue > 0 ? '+' : ''}${calibration.smallWaveValue}%`
        : `${calibration.smallWaveValue > 0 ? '+' : ''}${calibration.smallWaveValue}m`;
      const largeDesc = calibration.largeWaveType === 'percent'
        ? `${calibration.largeWaveValue > 0 ? '+' : ''}${calibration.largeWaveValue}%`
        : `${calibration.largeWaveValue > 0 ? '+' : ''}${calibration.largeWaveValue}m`;
      activeBadge.textContent = `≤${calibration.smallWaveThreshold}m: ${smallDesc} / >${calibration.largeWaveThreshold}m: ${largeDesc}`;
      activeBadge.title = 'Active wave calibration';
      rightSide.appendChild(activeBadge);
    }

    header.appendChild(title);
    header.appendChild(rightSide);
    card.appendChild(header);
    
    // Small waves section
    const smallSection = document.createElement('div');
    smallSection.style.cssText = 'margin-bottom: 12px; padding: 12px; background: #fff; border-radius: 8px;';
    smallSection.innerHTML = `
      <div style="font-weight: 700; color: #3498db; margin-bottom: 8px;">Small Waves (≤ threshold)</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <label style="color: #6c7a89;">Threshold:</label>
        <input type="number" class="input" id="small_threshold_${idSafe(group)}" value="${calibration?.smallWaveThreshold || 1}" step="0.1" min="0" max="5" style="width: 80px;" /> <small>m</small>
        <label style="color: #6c7a89; margin-left: 10px;">Adjustment:</label>
        <select class="select" id="small_type_${idSafe(group)}" style="width: 100px;">
          <option value="percent" ${calibration?.smallWaveType === 'percent' ? 'selected' : ''}>Percent</option>
          <option value="meters" ${calibration?.smallWaveType === 'meters' ? 'selected' : ''}>Meters</option>
        </select>
        <input type="number" class="input" id="small_value_${idSafe(group)}" value="${calibration?.smallWaveValue || -50}" step="0.1" style="width: 80px;" />
        <small id="small_unit_${idSafe(group)}">${calibration?.smallWaveType === 'meters' ? 'm' : '%'}</small>
      </div>
      <div style="margin-top: 6px; color: #6c7a89; font-size: 0.85em;">Example: -50% on 0.8m wave = 0.4m</div>
    `;
    card.appendChild(smallSection);
    
    // Large waves section
    const largeSection = document.createElement('div');
    largeSection.style.cssText = 'margin-bottom: 12px; padding: 12px; background: #fff; border-radius: 8px;';
    largeSection.innerHTML = `
      <div style="font-weight: 700; color: #e67e22; margin-bottom: 8px;">Large Waves (> threshold)</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
        <label style="color: #6c7a89;">Threshold:</label>
        <input type="number" class="input" id="large_threshold_${idSafe(group)}" value="${calibration?.largeWaveThreshold || 1}" step="0.1" min="0" max="5" style="width: 80px;" /> <small>m</small>
        <label style="color: #6c7a89; margin-left: 10px;">Adjustment:</label>
        <select class="select" id="large_type_${idSafe(group)}" style="width: 100px;">
          <option value="percent" ${calibration?.largeWaveType === 'percent' ? 'selected' : ''}>Percent</option>
          <option value="meters" ${calibration?.largeWaveType === 'meters' ? 'selected' : ''}>Meters</option>
        </select>
        <input type="number" class="input" id="large_value_${idSafe(group)}" value="${calibration?.largeWaveValue || -0.5}" step="0.1" style="width: 80px;" />
        <small id="large_unit_${idSafe(group)}">${calibration?.largeWaveType === 'meters' ? 'm' : '%'}</small>
      </div>
      <div style="margin-top: 6px; color: #6c7a89; font-size: 0.85em;">Example: -0.5m on 2m wave = 1.5m</div>
    `;
    card.appendChild(largeSection);
    
    // Update unit labels when type changes
    const smallTypeSelect = smallSection.querySelector(`#small_type_${idSafe(group)}`);
    const largeTypeSelect = largeSection.querySelector(`#large_type_${idSafe(group)}`);
    
    smallTypeSelect.addEventListener('change', () => {
      document.getElementById(`small_unit_${idSafe(group)}`).textContent = smallTypeSelect.value === 'meters' ? 'm' : '%';
    });
    
    largeTypeSelect.addEventListener('change', () => {
      document.getElementById(`large_unit_${idSafe(group)}`).textContent = largeTypeSelect.value === 'meters' ? 'm' : '%';
    });
    
    // Buttons
    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = 'display: flex; gap: 8px; margin-top: 12px;';
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'save';
    saveBtn.textContent = 'Save Calibration';
    saveBtn.onclick = () => saveFolderWaveCalibration(group);
    
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'actionbtn danger';
    clearBtn.textContent = 'Clear';
    clearBtn.style.cssText = 'background: #e74c3c; color: white;';
    clearBtn.onclick = () => {
      setFolderWaveCalibration(group, null);
      populateFolderWaveCalibrationList();
      refreshRealtimeForAllButtons();
      buildFoldersUI(); // Update folder calibration badge
    };
    
    buttonRow.appendChild(saveBtn);
    if (calibration) buttonRow.appendChild(clearBtn);
    card.appendChild(buttonRow);
    
    container.appendChild(card);
  }
}

function saveFolderWaveCalibration(folderName) {
  const safeName = idSafe(folderName);
  
  const calibration = {
    smallWaveThreshold: parseFloat(document.getElementById(`small_threshold_${safeName}`).value) || 1,
    smallWaveType: document.getElementById(`small_type_${safeName}`).value,
    smallWaveValue: parseFloat(document.getElementById(`small_value_${safeName}`).value) || 0,
    largeWaveThreshold: parseFloat(document.getElementById(`large_threshold_${safeName}`).value) || 1,
    largeWaveType: document.getElementById(`large_type_${safeName}`).value,
    largeWaveValue: parseFloat(document.getElementById(`large_value_${safeName}`).value) || 0
  };
  
  setFolderWaveCalibration(folderName, calibration);
  populateFolderWaveCalibrationList();
  refreshRealtimeForAllButtons();
  buildFoldersUI(); // Update folder calibration badge
}

// Event listeners
settingsBtn.addEventListener('click', () => openSettings('help'));
closeSettingsBtn.addEventListener('click', closeSettings);
settingsBackdrop.addEventListener('click', (e) => {
  if (e.target === settingsBackdrop) closeSettings();
});

settingsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    switchSettingsTab(tabName);
    
    // Populate content when switching tabs
    if (tabName === 'folders') {
      populateFolderRenameList();
      populateFolderWaveCalibrationList();
    } else if (tabName === 'bestspots') {
      renderBestSpotsList();
    } else if (tabName === 'history') {
      populateFolderHistoryList();
    }
  });
});

function populateFolderHistoryList() {
  const container = document.getElementById('folderHistoryList');
  if (!container) return;

  const history = getFolderHistory();
  if (history.length === 0) {
    container.innerHTML = '<p style="color: #6c7a89; font-style: italic;">No archived folders yet. Use the 🗑️ button on a folder to archive it here.</p>';
    return;
  }

  container.innerHTML = '';

  for (const entry of history) {
    const card = document.createElement('div');
    card.style.cssText = 'background: #f8f9fa; border-radius: 12px; border: 2px solid #dee2e6; padding: 16px;';

    const dateStr = new Date(entry.archivedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    // Header row
    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;';
    headerRow.innerHTML = `
      <div>
        <span style="font-size: 1.05em; font-weight: 700; color: #2c3e50;">📁 ${entry.folderName}</span>
        <span style="font-size: 0.8em; color: #6c7a89; margin-left: 8px;">${entry.spots.length} spot${entry.spots.length !== 1 ? 's' : ''} · archived ${dateStr}</span>
        ${entry.folderWaveCal ? '<span style="font-size: 0.75em; background: rgba(22,160,133,0.15); border: 1px solid #16a085; color: #138d75; border-radius: 4px; padding: 1px 5px; margin-left: 6px;">🌊⚙️ wave cal</span>' : ''}
      </div>
    `;

    // Action buttons
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;';

    const restoreAllBtn = document.createElement('button');
    restoreAllBtn.type = 'button';
    restoreAllBtn.textContent = '↩️ Restore All';
    restoreAllBtn.style.cssText = 'padding: 7px 14px; background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9em;';
    restoreAllBtn.onclick = () => {
      const count = restoreFolderFromHistory(entry.id);
      reloadPlacesKeepSelection();
      buildFoldersUI();
      refreshSelectedPanel();
      populateFolderHistoryList();
      if (count > 0) {
        restoreAllBtn.textContent = `✅ Restored ${count} spot${count !== 1 ? 's' : ''}!`;
        setTimeout(() => populateFolderHistoryList(), 2000);
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '🗑 Delete from history';
    deleteBtn.style.cssText = 'padding: 7px 14px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 0.9em;';
    deleteBtn.onclick = () => {
      if (!confirm(`Permanently delete "${entry.folderName}" from history? This cannot be undone.`)) return;
      deleteHistoryEntry(entry.id);
      populateFolderHistoryList();
    };

    btnRow.appendChild(restoreAllBtn);
    btnRow.appendChild(deleteBtn);

    // Spots section: scrollable list + sticky restore button at bottom
    const spotsSection = document.createElement('div');
    spotsSection.style.cssText = 'border: 1px solid #dee2e6; border-radius: 10px; overflow: hidden; margin-top: 4px;';

    const spotsLabel = document.createElement('div');
    spotsLabel.style.cssText = 'font-size: 0.85em; color: #5d6d7e; font-weight: 600; padding: 8px 10px; background: #f8f9fa; border-bottom: 1px solid #dee2e6;';
    spotsLabel.textContent = 'Select individual spots to restore:';

    // Scrollable spots list — max 220px so it never takes over the modal
    const spotsGrid = document.createElement('div');
    spotsGrid.style.cssText = 'display: grid; gap: 0; max-height: 220px; overflow-y: auto; -webkit-overflow-scrolling: touch;';

    for (const sp of entry.spots) {
      const row = document.createElement('label');
      row.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: white; cursor: pointer; border-bottom: 1px solid #f0f0f0;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.spotKey = sp.key;
      cb.style.cssText = 'width: 16px; height: 16px; cursor: pointer; flex-shrink: 0;';
      const calBadges = [
        sp._windRules && sp._windRules.length ? '🎯' : '',
        sp._spotWaveCal ? '🌊' : ''
      ].filter(Boolean).join('');
      row.innerHTML = `<span style="flex:1; font-size: 0.9em; color: #2c3e50; font-weight: 600;">${sp.name}${calBadges ? ' ' + calBadges : ''}</span><span style="font-size: 0.78em; color: #95a5a6;">${sp.lat.toFixed(3)}°, ${sp.lon.toFixed(3)}°</span>`;
      row.prepend(cb);
      spotsGrid.appendChild(row);
    }

    // Restore Selected button — stuck at bottom of the card, always visible
    const restoreSelectedBtn = document.createElement('button');
    restoreSelectedBtn.type = 'button';
    restoreSelectedBtn.textContent = '↩️ Restore Selected';
    restoreSelectedBtn.style.cssText = 'width: 100%; padding: 10px 14px; background: #3498db; color: white; border: none; border-top: 1px solid rgba(0,0,0,0.1); cursor: pointer; font-weight: 700; font-size: 0.95em; border-radius: 0;';
    restoreSelectedBtn.onclick = () => {
      const checked = Array.from(spotsGrid.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.dataset.spotKey);
      if (checked.length === 0) {
        restoreSelectedBtn.textContent = '⚠️ Select spots first';
        setTimeout(() => { restoreSelectedBtn.textContent = '↩️ Restore Selected'; }, 2000);
        return;
      }
      const count = restoreSpotsFromHistory(entry.id, checked);
      reloadPlacesKeepSelection();
      buildFoldersUI();
      refreshSelectedPanel();
      if (count > 0) {
        restoreSelectedBtn.textContent = `✅ Restored ${count} spot${count !== 1 ? 's' : ''}!`;
        setTimeout(() => { restoreSelectedBtn.textContent = '↩️ Restore Selected'; }, 2500);
      }
    };

    spotsSection.appendChild(spotsLabel);
    spotsSection.appendChild(spotsGrid);
    spotsSection.appendChild(restoreSelectedBtn);

    card.appendChild(headerRow);
    card.appendChild(btnRow);
    card.appendChild(spotsSection);
    container.appendChild(card);
  }
}
// v1771297632

// ── Export / Import ───────────────────────────────────────────────────────────

function buildExportBundle() {
  // Collect all spots with their calibration data
  const places = getPlaces();
  const spotsWithCal = places.map(p => ({
    ...p,
    _windRules:    getCalibrationRules(p.key),
    _spotWaveCal:  getSpotWaveCalibration(p.key),
  }));

  // Collect folder-level wave calibrations
  const folderCals = {};
  const groups = getAllGroups();
  for (const g of groups) {
    const cal = getFolderWaveCalibration(g);
    if (cal) folderCals[g] = cal;
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    spots: spotsWithCal,
    folderWaveCalibrations: folderCals,
  };
}

document.getElementById('exportDataBtn').addEventListener('click', () => {
  const bundle = buildExportBundle();
  const json   = JSON.stringify(bundle, null, 2);
  const blob   = new Blob([json], { type: 'application/json' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  const date   = new Date().toISOString().slice(0, 10);
  a.href       = url;
  a.download   = `wind-spots-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const status = document.getElementById('importStatus');
  status.style.display = 'none';

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const bundle = JSON.parse(ev.target.result);

      // Support both v1 bundle format and raw array (plain spots export)
      const incoming = Array.isArray(bundle) ? bundle : (bundle.spots || []);
      if (!incoming.length) throw new Error('No spots found in file');

      const mode = document.querySelector('input[name="importMode"]:checked').value;

      // Gather current places
      let places = mode === 'replace' ? [] : getPlaces();

      let addedCount = 0;
      for (const sp of incoming) {
        // Validate required fields
        if (!sp.key || !sp.name || typeof sp.lat !== 'number' || typeof sp.lon !== 'number') continue;

        const exists = places.some(p =>
          Math.abs(p.lat - sp.lat) < 0.001 && Math.abs(p.lon - sp.lon) < 0.001
        );
        if (exists && mode === 'merge') continue;

        const { _windRules, _spotWaveCal, ...cleanSpot } = sp;
        // Always generate a fresh key to avoid collisions
        cleanSpot.key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
        places.push(cleanSpot);

        if (_windRules   && _windRules.length) setCalibrationRules(cleanSpot.key, _windRules);
        if (_spotWaveCal)                      setSpotWaveCalibration(cleanSpot.key, _spotWaveCal);
        addedCount++;
      }

      savePlaces(places);

      // Restore folder wave calibrations if present
      if (bundle.folderWaveCalibrations) {
        for (const [folder, cal] of Object.entries(bundle.folderWaveCalibrations)) {
          setFolderWaveCalibration(folder, cal);
        }
      }

      reloadPlacesKeepSelection();
      buildFoldersUI();
      refreshSelectedPanel();

      status.style.display = 'block';
      status.style.background = '#d4edda';
      status.style.color = '#155724';
      status.style.border = '1px solid #c3e6cb';
      const total = places.length;
      status.textContent = mode === 'replace'
        ? `✅ Replaced all data — ${addedCount} spot${addedCount !== 1 ? 's' : ''} loaded.`
        : `✅ Added ${addedCount} new spot${addedCount !== 1 ? 's' : ''}. Total: ${total}.`;

    } catch (err) {
      const status = document.getElementById('importStatus');
      status.style.display = 'block';
      status.style.background = '#f8d7da';
      status.style.color = '#721c24';
      status.style.border = '1px solid #f5c6cb';
      status.textContent = `❌ Import failed: ${err.message}`;
    }

    // Reset file input so the same file can be re-imported if needed
    e.target.value = '';
  };
  reader.readAsText(file);
});
