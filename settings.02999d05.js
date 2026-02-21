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
    }
  });
});
// v1771297632
