// Calibration modal and compass
const calibrateBackdrop = document.getElementById('calibrateBackdrop');
const calibrateSelBtn = document.getElementById('calibrateSelBtn');
const closeCalibrateBtn = document.getElementById('closeCalibrateBtn');
const compassCanvas = document.getElementById('compassCanvas');
const calibrationRules = document.getElementById('calibration_rules');
const addCalibrationRule = document.getElementById('addCalibrationRule');
const calSpotName = document.getElementById('cal_spot_name');
const calValue = document.getElementById('cal_value');

let compassCtx = null;
let selectedSectors = [];
let calOperation = 'add'; // 'add' or 'subtract'
let calType = 'knots'; // 'knots' or 'percent'
let hoveredRuleIndex = null;

// Populate value dropdown
function populateValueDropdown() {
  calValue.innerHTML = '';
  if (calType === 'knots') {
    for (let i = 1; i <= 20; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i} knots`;
      calValue.appendChild(opt);
    }
  } else {
    for (let i = 5; i <= 50; i += 5) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i}%`;
      calValue.appendChild(opt);
    }
  }
}

function setCalOperation(op) {
  calOperation = op;
  document.getElementById('cal_add').className = op === 'add' ? 'toggle-btn active' : 'toggle-btn';
  document.getElementById('cal_subtract').className = op === 'subtract' ? 'toggle-btn active' : 'toggle-btn';
  
  if (op === 'add') {
    document.getElementById('cal_add').style.background = '#27ae60';
    document.getElementById('cal_add').style.color = 'white';
    document.getElementById('cal_subtract').style.background = 'white';
    document.getElementById('cal_subtract').style.color = '#e74c3c';
  } else {
    document.getElementById('cal_subtract').style.background = '#e74c3c';
    document.getElementById('cal_subtract').style.color = 'white';
    document.getElementById('cal_add').style.background = 'white';
    document.getElementById('cal_add').style.color = '#27ae60';
  }
}

function setCalType(type) {
  calType = type;
  document.getElementById('cal_knots').className = type === 'knots' ? 'toggle-btn active' : 'toggle-btn';
  document.getElementById('cal_percent').className = type === 'percent' ? 'toggle-btn active' : 'toggle-btn';
  
  if (type === 'knots') {
    document.getElementById('cal_knots').style.background = '#3498db';
    document.getElementById('cal_knots').style.color = 'white';
    document.getElementById('cal_percent').style.background = 'white';
    document.getElementById('cal_percent').style.color = '#9b59b6';
  } else {
    document.getElementById('cal_percent').style.background = '#9b59b6';
    document.getElementById('cal_percent').style.color = 'white';
    document.getElementById('cal_knots').style.background = 'white';
    document.getElementById('cal_knots').style.color = '#3498db';
  }
  
  populateValueDropdown();
}

window.setCalOperation = setCalOperation;
window.setCalType = setCalType;

// Wave condition controls
const calWaveEnabled = document.getElementById('cal_wave_enabled');
const calWaveCondition = document.getElementById('cal_wave_condition');
const calWaveThreshold = document.getElementById('cal_wave_threshold');

const calWindEnabled = document.getElementById('cal_wind_enabled');
const calWindCondition = document.getElementById('cal_wind_condition');
const calWindThreshold = document.getElementById('cal_wind_threshold');

const calGustEnabled = document.getElementById('cal_gust_enabled');
const calGustCondition = document.getElementById('cal_gust_condition');
const calGustThreshold = document.getElementById('cal_gust_threshold');

calWaveEnabled.addEventListener('change', () => {
  calWaveCondition.disabled = !calWaveEnabled.checked;
  calWaveThreshold.disabled = !calWaveEnabled.checked;
});

calWindEnabled.addEventListener('change', () => {
  calWindCondition.disabled = !calWindEnabled.checked;
  calWindThreshold.disabled = !calWindEnabled.checked;
});

calGustEnabled.addEventListener('change', () => {
  calGustCondition.disabled = !calGustEnabled.checked;
  calGustThreshold.disabled = !calGustEnabled.checked;
});

// Spot wave calibration unit labels
document.getElementById('spot_wave_small_op').addEventListener('change', function() {
  document.getElementById('spot_wave_small_unit').textContent = this.value === 'meters' ? 'cm' : '%';
});
document.getElementById('spot_wave_large_op').addEventListener('change', function() {
  document.getElementById('spot_wave_large_unit').textContent = this.value === 'meters' ? 'cm' : '%';
});

document.getElementById('saveSpotWaveCal').addEventListener('click', () => {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  const cal = {
    smallThreshold: parseFloat(document.getElementById('spot_wave_small_threshold').value) || 1,
    smallOp: document.getElementById('spot_wave_small_op').value,
    smallVal: parseFloat(document.getElementById('spot_wave_small_val').value) || 0,
    largeThreshold: parseFloat(document.getElementById('spot_wave_large_threshold').value) || 1,
    largeOp: document.getElementById('spot_wave_large_op').value,
    largeVal: parseFloat(document.getElementById('spot_wave_large_val').value) || 0,
  };
  setSpotWaveCalibration(loc.key, cal);
  document.getElementById('clearSpotWaveCal').style.display = 'inline-block';
  const status = document.getElementById('spotWaveCalStatus');
  status.textContent = '✅ Saved! Will apply on next data refresh.';
  status.style.display = 'block';
  setTimeout(() => status.style.display = 'none', 3000);
  refreshRealtimeForAllButtons();
  buildFoldersUI(); // Update calibration icons on spots
});

document.getElementById('clearSpotWaveCal').addEventListener('click', () => {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  setSpotWaveCalibration(loc.key, null);
  loadSpotWaveCalIntoModal(null);
  document.getElementById('clearSpotWaveCal').style.display = 'none';
  refreshRealtimeForAllButtons();
  buildFoldersUI(); // Update calibration icons on spots
});

function loadSpotWaveCalIntoModal(cal) {
  document.getElementById('spot_wave_small_threshold').value = cal?.smallThreshold ?? 1;
  document.getElementById('spot_wave_small_op').value = cal?.smallOp ?? 'percent';
  document.getElementById('spot_wave_small_val').value = cal?.smallVal ?? -50;
  document.getElementById('spot_wave_small_unit').textContent = (cal?.smallOp === 'meters') ? 'cm' : '%';
  document.getElementById('spot_wave_large_threshold').value = cal?.largeThreshold ?? 1;
  document.getElementById('spot_wave_large_op').value = cal?.largeOp ?? 'meters';
  document.getElementById('spot_wave_large_val').value = cal?.largeVal ?? -50;
  document.getElementById('spot_wave_large_unit').textContent = (cal?.largeOp === 'meters') ? 'cm' : '%';
  document.getElementById('clearSpotWaveCal').style.display = cal ? 'inline-block' : 'none';
  document.getElementById('spotWaveCalStatus').style.display = 'none';
}

function openCalibration() {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  
  calSpotName.textContent = loc.name;
  selectedSectors = [];
  calOperation = 'add';
  calType = 'knots';
  hoveredRuleIndex = null;
  
  setCalOperation('add');
  setCalType('knots');
  
  if (!compassCtx) {
    compassCtx = compassCanvas.getContext('2d');
    setupCompassInteraction();
  }
  
  drawCompass();
  renderCalibrationRules();
  
  // Load spot wave calibration
  const spotWaveCal = getSpotWaveCalibration(loc.key);
  loadSpotWaveCalIntoModal(spotWaveCal);
  
  calibrateBackdrop.style.display = 'flex';
  calibrateBackdrop.setAttribute('aria-hidden', 'false');
}

function closeCalibration() {
  calibrateBackdrop.style.display = 'none';
  calibrateBackdrop.setAttribute('aria-hidden', 'true');
  hoveredRuleIndex = null;
  drawCompass();
}

calibrateSelBtn.addEventListener('click', openCalibration);
closeCalibrateBtn.addEventListener('click', closeCalibration);
calibrateBackdrop.addEventListener('click', (e) => {
  if (e.target === calibrateBackdrop) closeCalibration();
});

function drawCompass() {
  const centerX = 140;
  const centerY = 140;
  const radius = 110;
  
  compassCtx.clearRect(0, 0, 280, 280);
  
  // Draw 16 sectors
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  
  // Determine which sectors to highlight for hovered rule
  let hoveredSectors = [];
  if (hoveredRuleIndex !== null) {
    const loc = PLACES[currentIndex];
    if (loc) {
      const rules = getCalibrationRules(loc.key);
      if (rules[hoveredRuleIndex]) {
        hoveredSectors = rules[hoveredRuleIndex].sectors;
      }
    }
  }
  
  for (let i = 0; i < 16; i++) {
    const startAngle = (i * 22.5 - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * 22.5 - 90) * Math.PI / 180;
    const midAngle = ((i * 22.5 + 11.25) - 90) * Math.PI / 180;
    
    const isSelected = selectedSectors.includes(i);
    const isHovered = hoveredSectors.includes(i);
    
    // Draw sector
    compassCtx.beginPath();
    compassCtx.moveTo(centerX, centerY);
    compassCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    compassCtx.closePath();
    
    if (isHovered) {
      compassCtx.fillStyle = 'rgba(241, 196, 15, 0.5)'; // Yellow for hovered rule
    } else if (isSelected) {
      compassCtx.fillStyle = 'rgba(52, 152, 219, 0.5)'; // Blue for selection
    } else {
      compassCtx.fillStyle = 'rgba(200, 200, 200, 0.2)';
    }
    compassCtx.fill();
    
    compassCtx.strokeStyle = isHovered ? '#f39c12' : (isSelected ? '#3498db' : '#95a5a6');
    compassCtx.lineWidth = isHovered ? 3 : (isSelected ? 2 : 1);
    compassCtx.stroke();
    
    // Draw direction label
    const labelRadius = radius + 20;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;
    
    compassCtx.fillStyle = '#2c3e50';
    compassCtx.font = 'bold 10px Arial';
    compassCtx.textAlign = 'center';
    compassCtx.textBaseline = 'middle';
    compassCtx.fillText(directions[i], labelX, labelY);
  }
  
  // Draw center circle
  compassCtx.beginPath();
  compassCtx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
  compassCtx.fillStyle = '#2c3e50';
  compassCtx.fill();
}

function setupCompassInteraction() {
  compassCanvas.addEventListener('click', (e) => {
    const rect = compassCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = 140;
    const centerY = 140;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 8 && distance < 110) {
      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      
      const sector = Math.floor(angle / 22.5);
      
      const idx = selectedSectors.indexOf(sector);
      if (idx >= 0) {
        selectedSectors.splice(idx, 1);
      } else {
        selectedSectors.push(sector);
      }
      
      drawCompass();
    }
  });
}

function getDirectionLabel(sectors) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  if (sectors.length === 0) return 'None';
  if (sectors.length === 1) return directions[sectors[0]];
  
  const sorted = [...sectors].sort((a, b) => a - b);
  return `${directions[sorted[0]]}-${directions[sorted[sorted.length - 1]]}`;
}

addCalibrationRule.addEventListener('click', () => {
  if (selectedSectors.length === 0) {
    return; // Just don't add if nothing selected
  }
  
  const value = parseFloat(calValue.value);
  const adjustedValue = calOperation === 'subtract' ? -value : value;
  
  const loc = PLACES[currentIndex];
  if (!loc) return;
  
  const rules = getCalibrationRules(loc.key);
  
  const rule = {
    sectors: [...selectedSectors],
    type: calType,
    value: adjustedValue,
    label: getDirectionLabel(selectedSectors)
  };
  
  // Add wave condition if enabled
  if (calWaveEnabled.checked) {
    rule.waveCondition = {
      type: calWaveCondition.value,
      threshold: parseFloat(calWaveThreshold.value)
    };
  }

  // Add wind speed condition if enabled
  if (calWindEnabled.checked) {
    rule.windCondition = {
      type: calWindCondition.value,
      threshold: parseFloat(calWindThreshold.value)
    };
  }

  // Add gust condition if enabled
  if (calGustEnabled.checked) {
    rule.gustCondition = {
      type: calGustCondition.value,
      threshold: parseFloat(calGustThreshold.value)
    };
  }

  rules.push(rule);
  setCalibrationRules(loc.key, rules);

  selectedSectors = [];
  calWaveEnabled.checked = false;
  calWaveCondition.disabled = true;
  calWaveThreshold.disabled = true;
  calWindEnabled.checked = false;
  calWindCondition.disabled = true;
  calWindThreshold.disabled = true;
  calGustEnabled.checked = false;
  calGustCondition.disabled = true;
  calGustThreshold.disabled = true;
  drawCompass();
  renderCalibrationRules();
  buildFoldersUI(); // Update calibration icons on spots
});

function renderCalibrationRules() {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  
  const rules = getCalibrationRules(loc.key);
  
  if (rules.length === 0) {
    calibrationRules.innerHTML = '<div style="color: #7f8c8d; font-style: italic; text-align: center; padding: 20px;">No rules yet. Select directions and click "Add Rule".</div>';
    return;
  }
  
  let html = '<div style="font-weight: 900; margin-bottom: 8px; color: #2c3e50;">Active Rules:</div>';
  
  rules.forEach((rule, idx) => {
    const sign = rule.value >= 0 ? '+' : '';
    const valueText = rule.type === 'knots' 
      ? `${sign}${rule.value} kts` 
      : `${sign}${rule.value}%`;
    
    let conditionText = '';
    const conds = [];
    if (rule.windCondition) {
      const t = rule.windCondition.type === 'less' ? '<' : '>';
      conds.push(`💨 wind ${t} ${rule.windCondition.threshold}k`);
    }
    if (rule.gustCondition) {
      const t = rule.gustCondition.type === 'less' ? '<' : '>';
      conds.push(`↑gust ${t} ${rule.gustCondition.threshold}k`);
    }
    if (rule.waveCondition) {
      const t = rule.waveCondition.type === 'less' ? '<' : '>';
      conds.push(`🌊 ${t} ${rule.waveCondition.threshold}m`);
    }
    if (conds.length) {
      conditionText = ` <span style="color: #2471a3; font-size: 0.82em;">(${conds.join(' & ')})</span>`;
    }
    
    html += `
      <div 
        onmouseenter="highlightRuleSectors(${idx})" 
        onmouseleave="clearHighlight()"
        style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #ecf0f1; border-radius: 6px; margin-bottom: 6px; cursor: pointer; transition: background 0.2s;">
        <div>
          <span style="font-weight: 900; color: #2c3e50;">${rule.label}:</span> 
          <span style="color: ${rule.value >= 0 ? '#27ae60' : '#e74c3c'}; font-weight: 900;">${valueText}</span>${conditionText}
        </div>
        <button onclick="deleteCalibrationRule(${idx})" style="padding: 6px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 900;">✖</button>
      </div>
    `;
  });
  
  calibrationRules.innerHTML = html;
}

function highlightRuleSectors(idx) {
  hoveredRuleIndex = idx;
  drawCompass();
}

function clearHighlight() {
  hoveredRuleIndex = null;
  drawCompass();
}

window.highlightRuleSectors = highlightRuleSectors;
window.clearHighlight = clearHighlight;

function deleteCalibrationRule(idx) {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  
  const rules = getCalibrationRules(loc.key);
  rules.splice(idx, 1);
  setCalibrationRules(loc.key, rules);
  
  renderCalibrationRules();
  buildFoldersUI(); // Update calibration icons on spots
}

// Apply calibration to wind data
// v1771297632
