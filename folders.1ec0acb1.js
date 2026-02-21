// Folders and spots UI management

function updateFolderBestWindBadges() {
  // Update best wind badges for all folders without rebuilding everything
  const groups = {};
  for (const p of PLACES) {
    const g = normalizeGroupName(p.group);
    if (!groups[g]) groups[g] = [];
    groups[g].push(p);
  }
  
  for (const [gName, spots] of Object.entries(groups)) {
    const folder = document.querySelector(`.folder[data-group="${gName}"]`);
    if (!folder) continue;
    
    const header = folder.querySelector('.folder-header');
    if (!header) continue;
    
    // Remove old badge if exists
    const oldBadge = header.querySelector('.folder-best-wind-badge');
    if (oldBadge) oldBadge.remove();
    
    // Find and add new badge
    const bestWindSpot = getBestWindSpotForToday(spots);
    if (bestWindSpot) {
      const badge = document.createElement('div');
      badge.className = 'folder-best-wind-badge';
      badge.innerHTML = `🔥 ${bestWindSpot.name}`;
      header.appendChild(badge);
    }
  }
}

function updateSpotBestWindHighlight() {
  // Update best-wind-today class on spot buttons
  const groups = {};
  for (const p of PLACES) {
    const g = normalizeGroupName(p.group);
    if (!groups[g]) groups[g] = [];
    groups[g].push(p);
  }
  
  // Remove all existing highlights
  document.querySelectorAll('.btn.best-wind-today').forEach(btn => {
    btn.classList.remove('best-wind-today');
  });
  
  // Add highlights to best spots in each folder
  for (const [gName, spots] of Object.entries(groups)) {
    const bestWindSpot = getBestWindSpotForToday(spots);
    if (bestWindSpot) {
      const btn = document.querySelector(`.btn[data-key="${bestWindSpot.key}"]`);
      if (btn) {
        btn.classList.add('best-wind-today');
      }
    }
  }
}

function getBestWindSpotForToday(spots) {
  // Find the spot with the highest wind forecast for today (only if gust > 20 knots)
  let bestSpot = null;
  let maxWind = 20; // Minimum threshold - must be above 20 knots
  
  for (const spot of spots) {
    const cache = currentCache[spot.key];
    if (cache && typeof cache.gust === 'number' && cache.gust > maxWind) {
      maxWind = cache.gust;
      bestSpot = spot;
    }
  }
  
  return bestSpot;
}

function folderColorForName(name) {
  // Deterministic color per folder name (so it stays stable across reloads)
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return {
    bg: `hsl(${hue} 85% 95%)`,
    accent: `hsl(${hue} 75% 45%)`
  };
}

function buildFoldersUI() {
  const wrap = document.getElementById('folders');
  wrap.innerHTML = '';

  const groups = {};
  for (const p of PLACES) {
    const g = normalizeGroupName(p.group);
    if (!groups[g]) groups[g] = [];
    groups[g].push(p);
  }

  // Get saved folder order or default to alphabetical
  let groupNames = Object.keys(groups);
  try {
    const savedOrder = localStorage.getItem('wind_folder_order_v1');
    if (savedOrder) {
      const orderArray = JSON.parse(savedOrder);
      // Filter to only include folders that still exist, then add any new ones
      const ordered = orderArray.filter(name => groupNames.includes(name));
      const remaining = groupNames.filter(name => !ordered.includes(name));
      groupNames = [...ordered, ...remaining.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))];
    } else {
      groupNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }
  } catch (e) {
    groupNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }

  const collapsedState = getFolderCollapsed();
  const spotOrders = getSpotOrder();
  
  for (const gName of groupNames) {
    const folder = document.createElement('div');
    folder.className = 'folder';
    if (collapsedState[gName]) {
      folder.classList.add('collapsed');
    }
    folder.dataset.group = gName;

    const header = document.createElement('div');
    header.className = 'folder-header';
    const fc = folderColorForName(gName);
    header.style.setProperty('--folder-bg', fc.bg);
    header.style.setProperty('--folder-accent', fc.accent);

    // Find best wind spot for this folder
    const bestWindSpot = getBestWindSpotForToday(groups[gName]);
    const bestWindBadge = bestWindSpot 
      ? `<div class="folder-best-wind-badge">🔥 ${bestWindSpot.name}</div>` 
      : '';
    
    header.innerHTML = `
      <div class="folder-title">
        <span class="folder-arrow">▼</span>
        <span class="folder-name-display" data-group="${gName}">${gName}</span>
        <span class="folder-pill">${groups[gName].length} spots</span>
      </div>
      ${bestWindBadge}
    `;

    // Toggle collapse on header click
    header.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
      folder.classList.toggle('collapsed');
      setFolderCollapsed(gName, folder.classList.contains('collapsed'));
    });

    const drop = document.createElement('div');
    drop.className = 'folder-drop';

    const grid = document.createElement('div');
    grid.className = 'spots-grid';
    grid.dataset.group = gName;

    // Apply custom order if exists
    let orderedSpots = groups[gName];
    if (spotOrders[gName]) {
      const orderMap = new Map(orderedSpots.map(s => [s.key, s]));
      const ordered = [];
      for (const key of spotOrders[gName]) {
        if (orderMap.has(key)) {
          ordered.push(orderMap.get(key));
          orderMap.delete(key);
        }
      }
      // Add any new spots that weren't in the saved order
      ordered.push(...orderMap.values());
      orderedSpots = ordered;
    }

    orderedSpots.forEach((loc) => {
      const idx = PLACES.findIndex(p => p.key === loc.key);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn' + (idx === currentIndex ? ' active' : '');
      
      // Highlight if this is the best wind spot
      if (bestWindSpot && bestWindSpot.key === loc.key) {
        b.classList.add('best-wind-today');
      }
      
      b.draggable = true;
      b.dataset.key = loc.key;

      // Check if spot has calibration rules
      const hasCalibration = getCalibrationRules(loc.key).length > 0;
      const calibrationStar = hasCalibration ? ' ⭐' : '';

      b.innerHTML = `
        <div class="name">${loc.name}${calibrationStar}</div>
        <div class="sub">
          <span class="wpDot" id="btn_wp_${loc.key}" title="wave period color"></span>
          <span id="btn_rt_${loc.key}">…</span>
        </div>
      `;

      b.addEventListener('click', () => {
        currentIndex = idx;
        setLastSelectedKey(loc.key);
        setHeader();
        refreshSelectedPanel();
        highlightActiveButton();
        loadForecastForSelected();
        renderSelectedNowFromCache();
        
        // Scroll to the chart content on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            const contentEl = document.getElementById('content');
            if (contentEl) {
              contentEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      });

      b.addEventListener('dragstart', (ev) => {
        b.classList.add('dragging');
        ev.dataTransfer.setData('text/plain', loc.key);
        ev.dataTransfer.setData('source-group', gName);
        ev.dataTransfer.effectAllowed = 'move';
      });
      b.addEventListener('dragend', () => b.classList.remove('dragging'));

      grid.appendChild(b);
    });

    // Allow dropping within the same grid for reordering
    grid.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      const afterElement = getDragAfterElement(grid, ev.clientY);
      const draggable = document.querySelector('.dragging');
      if (!draggable) return;
      
      if (afterElement == null) {
        grid.appendChild(draggable);
      } else {
        grid.insertBefore(draggable, afterElement);
      }
    });

    grid.addEventListener('drop', (ev) => {
      ev.preventDefault();
      const key = ev.dataTransfer.getData('text/plain');
      const sourceGroup = ev.dataTransfer.getData('source-group');
      
      // Save the new order
      const buttons = Array.from(grid.querySelectorAll('.btn'));
      const newOrder = buttons.map(b => b.dataset.key);
      setSpotOrder(gName, newOrder);
      
      // If moving between groups, update the group
      if (sourceGroup && sourceGroup !== gName) {
        movePlaceToGroup(key, gName);
      }
    });

    drop.appendChild(grid);

    folder.addEventListener('dragover', (ev) => {
      ev.preventDefault();
      folder.classList.add('dragover');
      ev.dataTransfer.dropEffect = 'move';
    });
    folder.addEventListener('dragleave', () => folder.classList.remove('dragover'));
    folder.addEventListener('drop', (ev) => {
      ev.preventDefault();
      folder.classList.remove('dragover');
      const key = ev.dataTransfer.getData('text/plain');
      if (!key) return;
      movePlaceToGroup(key, gName);
    });

    folder.appendChild(header);
    folder.appendChild(drop);
    wrap.appendChild(folder);
  }

  PLACES.forEach(loc => updateButtonRealtime(loc.key));
  highlightActiveButton();
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.btn:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function editFolderName(oldName) {
  const newName = prompt(`Rename folder "${oldName}" to:`, oldName);
  if (!newName || !newName.trim() || newName === oldName) return;
  
  const normalized = normalizeGroupName(newName);
  
  // Check if new name already exists
  const groups = getAllGroups();
  if (groups.includes(normalized) && normalized !== oldName) {
    return; // Just don't rename if name exists
  }
  
  // Rename all places in this folder
  const places = getPlaces();
  let changed = false;
  for (const p of places) {
    if (normalizeGroupName(p.group) === oldName) {
      p.group = normalized;
      changed = true;
    }
  }
  
  if (changed) {
    savePlaces(places);
    reloadPlacesKeepSelection();
    buildFoldersUI();
    refreshSelectedPanel();
  }
}

function movePlaceToGroup(key, groupName) {
  const places = getPlaces();
  const idx = places.findIndex(p => p.key === key);
  if (idx < 0) return;
  places[idx].group = normalizeGroupName(groupName);
  savePlaces(places);

  const lastKey = key;
  reloadPlacesKeepSelection();
  currentIndex = Math.max(0, PLACES.findIndex(p => p.key === lastKey));
  if (currentIndex < 0) currentIndex = 0;
  if (PLACES[currentIndex]) setLastSelectedKey(PLACES[currentIndex].key);

  buildFoldersUI();
  setHeader();
  refreshSelectedPanel();
}
