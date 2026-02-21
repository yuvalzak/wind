// UI state management
let PLACES = [];
let currentIndex = 0;
const currentCache = {};
let currentFetchToken = 0;
const charts = [];
let syncingScroll = false;
const windAnimByCanvasId = new Map();

function reloadPlacesKeepSelection() {
  const lastKey = PLACES[currentIndex]?.key || getLastSelectedKey();
  PLACES = sortPlaces(getPlaces()).map(p => {
    const fp = buildForecastPoint(p);
    return { ...p, forecastLat: fp.lat, forecastLon: fp.lon };
  });

  let idx = PLACES.findIndex(p => p.key === lastKey);
  if (idx < 0) idx = 0;
  currentIndex = Math.max(0, Math.min(idx, PLACES.length - 1));
  if (PLACES[currentIndex]) setLastSelectedKey(PLACES[currentIndex].key);
}

function setHeader() {
  const loc = PLACES[currentIndex];
  const coordText = loc ? `Forecast: ${loc.forecastLat.toFixed(5)}°N, ${loc.forecastLon.toFixed(5)}°E` : '';
  document.getElementById('title').textContent = loc ? `🌊 ${loc.name}` : '🌊 Wind + Waves Forecast';
  document.getElementById('subtitle').textContent = coordText ? `${coordText} • Model: ICON Global` : 'Loading…';
}

function setWaveDotFromPeriod(p) {
  const dot = document.getElementById('now_waveDot');
  if (!dot) return;
  dot.style.background = wavePeriodColor(p);
}

// Helper: set a directional arrow rotation based on degrees
// Arrow ➤ points right (East=90°). We rotate so it points in the direction FROM which it comes.
// Wind direction is where wind comes FROM, so arrow points INTO that direction (toward viewer)
// We add 90° offset because ➤ naturally points East (90°)
function setDirectionArrow(arrowId, degrees) {
  const el = document.getElementById(arrowId);
  if (!el) return;
  if (degrees === null || degrees === undefined || isNaN(degrees)) {
    el.style.transform = 'rotate(0deg)';
    el.style.opacity = '0.3';
    return;
  }
  // Rotate arrow to point FROM the given direction (wind comes FROM that direction)
  el.style.transform = `rotate(${degrees + 90}deg)`;
  el.style.opacity = '1';
}

function setNowBarLoading() {
  document.getElementById('now_status').textContent = `…`;
  document.getElementById('now_temp').innerHTML = `Air: … <small>°C</small>`;
  document.getElementById('now_water').style.display = 'none';
  document.getElementById('now_visibility').innerHTML = `👁️ Vis: … <small>km</small>`;
  document.getElementById('now_clouds').innerHTML = `☁️ Clouds: … <small>%</small>`;
  document.getElementById('now_aqi').innerHTML = `<span class="aqiDot" id="now_aqiDot"></span> AQI: … <small id="now_aqi_label"></small>`;
  document.getElementById('now_lightning').style.display = 'none';
  document.getElementById('now_gust').innerHTML = `<span class="gustIcon" aria-hidden="true"></span> Gust: … <small>k</small>`;
  document.getElementById('now_wind').innerHTML = `Wind: … <small>k</small>`;
  document.getElementById('now_dir_text').textContent = '…';
  setDirectionArrow('now_wind_arrow', null);
  document.getElementById('now_wave').innerHTML =
    `<span class="waveDot" id="now_waveDot" title="wave period color"></span> Wave: … <small>m</small> / … <small>s</small>`;
  document.getElementById('now_wave_dir_text').textContent = '…';
  setDirectionArrow('now_wave_arrow', null);
  document.getElementById('now_wave_score').innerHTML = `<span style="margin-right: 4px;">🏄</span> Wave: … <small>/10</small>`;
  document.getElementById('now_flat_score').innerHTML = `<span style="margin-right: 4px;">🛟</span> Flat: … <small>/10</small>`;
  setWaveDotFromPeriod(NaN);
}

function setNowBarUnavailable() {
  document.getElementById('now_status').textContent = `—`;
  document.getElementById('now_temp').innerHTML = `Air: — <small>°C</small>`;
  document.getElementById('now_water').style.display = 'none';
  document.getElementById('now_visibility').innerHTML = `👁️ Vis: — <small>km</small>`;
  document.getElementById('now_clouds').innerHTML = `☁️ Clouds: — <small>%</small>`;
  document.getElementById('now_aqi').innerHTML = `<span class="aqiDot" id="now_aqiDot"></span> AQI: — <small id="now_aqi_label"></small>`;
  document.getElementById('now_lightning').style.display = 'none';
  document.getElementById('now_gust').innerHTML = `<span class="gustIcon" aria-hidden="true"></span> Gust: — <small>k</small>`;
  document.getElementById('now_wind').innerHTML = `Wind: — <small>k</small>`;
  document.getElementById('now_dir_text').textContent = '—';
  setDirectionArrow('now_wind_arrow', null);
  document.getElementById('now_wave').innerHTML =
    `<span class="waveDot" id="now_waveDot" title="wave period color"></span> Wave: — <small>m</small> / — <small>s</small>`;
  document.getElementById('now_wave_dir_text').textContent = '—';
  setDirectionArrow('now_wave_arrow', null);
  document.getElementById('now_wave_score').innerHTML = `<span style="margin-right: 4px;">🏄</span> Wave: — <small>/10</small>`;
  document.getElementById('now_flat_score').innerHTML = `<span style="margin-right: 4px;">🛟</span> Flat: — <small>/10</small>`;
  setWaveDotFromPeriod(NaN);
}

function renderSelectedNowFromCache() {
  const loc = PLACES[currentIndex];
  if (!loc) return;
  const c = currentCache[loc.key];
  if (!c) {
    setNowBarLoading();
    return;
  }

  document.getElementById('now_status').textContent = c.timeStr ? `${c.timeStr}` : ``;
  document.getElementById('now_temp').innerHTML = `Air: ${c.airTemp ?? '—'} <small>°C</small>`;
  
  // Hide water temp if not available
  const waterPill = document.getElementById('now_water');
  if (c.waterTemp && c.waterTemp !== '—') {
    waterPill.style.display = 'flex';
    waterPill.innerHTML = `Water: ${c.waterTemp} <small>°C</small>`;
  } else {
    waterPill.style.display = 'none';
  }
  
  // Update AQI
  const aqiPill = document.getElementById('now_aqi');
  const aqiDot = document.getElementById('now_aqiDot');
  const aqiLabel = document.getElementById('now_aqi_label');
  
  if (c.aqi !== null && c.aqi !== undefined && c.aqi !== '—') {
    aqiPill.title = getAQIDescription(c.aqi);
    aqiPill.innerHTML = `<span class="aqiDot" id="now_aqiDot" style="background: ${getAQIColor(c.aqi)}"></span> AQI: ${c.aqi} <small id="now_aqi_label">${getAQILabel(c.aqi)}</small>`;
  } else {
    aqiPill.innerHTML = `<span class="aqiDot" id="now_aqiDot"></span> AQI: — <small id="now_aqi_label"></small>`;
  }
  
  document.getElementById('now_gust').innerHTML = `<span class="gustIcon" aria-hidden="true"></span> Gust: ${c.gust ?? '—'} <small>k</small>`;
  document.getElementById('now_wind').innerHTML = `Wind: ${c.wind ?? '—'} <small>k</small>`;
  
  // Wind direction with rotating arrow
  document.getElementById('now_dir_text').textContent = c.card ?? '—';
  setDirectionArrow('now_wind_arrow', c.dir ?? null);
  document.getElementById('now_dir').title = `Wind from ${c.card ?? '—'} (${c.dir ?? '—'}°)`;
  
  // Update visibility
  const visibilityPill = document.getElementById('now_visibility');
  if (c.visibility && c.visibility !== '—') {
    visibilityPill.innerHTML = `👁️ Vis: ${c.visibility} <small>km</small>`;
  } else {
    visibilityPill.innerHTML = `👁️ Vis: — <small>km</small>`;
  }
  
  // Update cloud cover
  const cloudsPill = document.getElementById('now_clouds');
  if (c.cloudCover !== null && c.cloudCover !== undefined && c.cloudCover !== '—') {
    cloudsPill.innerHTML = `☁️ Clouds: ${c.cloudCover} <small>%</small>`;
  } else {
    cloudsPill.innerHTML = `☁️ Clouds: — <small>%</small>`;
  }
  
  // Update lightning (only show if > 0)
  const lightningPill = document.getElementById('now_lightning');
  if (c.lightning && c.lightning > 0) {
    lightningPill.style.display = 'flex';
    lightningPill.innerHTML = `⚡ Lightning: ${c.lightning} <small>%</small>`;
  } else {
    lightningPill.style.display = 'none';
  }
  
  document.getElementById('now_wave').innerHTML =
    `<span class="waveDot" id="now_waveDot" title="wave period color"></span> Wave: ${c.waveH ?? '—'} <small>m</small> / ${c.waveP ?? '—'} <small>s</small>`;
  setWaveDotFromPeriod(c.waveP);
  
  // Wave direction with rotating arrow
  const waveDirPill = document.getElementById('now_wave_dir');
  if (c.waveDir !== null && c.waveDir !== undefined && c.waveDir !== '—') {
    const waveCard = degToCardinal(c.waveDir);
    document.getElementById('now_wave_dir_text').textContent = waveCard;
    setDirectionArrow('now_wave_arrow', c.waveDir);
    waveDirPill.title = `Waves coming from ${waveCard} (${c.waveDir}°)`;
  } else {
    document.getElementById('now_wave_dir_text').textContent = '—';
    setDirectionArrow('now_wave_arrow', null);
  }
  
  // Calculate and display sea quality scores with wave calibration
  const waveScorePill = document.getElementById('now_wave_score');
  const flatScorePill = document.getElementById('now_flat_score');
  
  if (c.waveH && c.waveP && c.waveH !== '—' && !isNaN(c.waveP)) {
    // Apply wave calibration
    const loc = PLACES[currentIndex];
    const rawWaveHeight = parseFloat(c.waveH);
    const calibratedWaveHeight = loc ? applyWaveCalibration(rawWaveHeight, loc.key, loc.group) : rawWaveHeight;
    
    // Update wave display with calibrated value if different
    if (calibratedWaveHeight !== rawWaveHeight) {
      document.getElementById('now_wave').innerHTML =
        `<span class="waveDot" id="now_waveDot" title="wave period color"></span> Wave: ${calibratedWaveHeight.toFixed(1)} <small>m</small> / ${c.waveP} <small>s</small> <span style="color: #6c7a89; font-size: 0.85em;">(cal)</span>`;
      setWaveDotFromPeriod(c.waveP);
    }
    
    const waveScore = calculateWaveRidingScore(calibratedWaveHeight, c.waveP);
    const flatScore = calculateFlatWaterScore(calibratedWaveHeight, c.waveP);
    const waveColor = getSeaQualityColor(waveScore);
    const flatColor = getSeaQualityColor(flatScore);
    const waveLabel = getSeaQualityLabel(waveScore);
    const flatLabel = getSeaQualityLabel(flatScore);
    
    waveScorePill.innerHTML = `<span style="margin-right: 4px;">🏄</span> Wave: <strong style="color: ${waveColor}">${waveScore}</strong> <small>/10 ${waveLabel}</small>`;
    waveScorePill.title = `Wave Riding Score: ${waveScore}/10 (${waveLabel}) - For surfing, wing foiling`;
    
    flatScorePill.innerHTML = `<span style="margin-right: 4px;">🛟</span> Flat: <strong style="color: ${flatColor}">${flatScore}</strong> <small>/10 ${flatLabel}</small>`;
    flatScorePill.title = `Flat Water Score: ${flatScore}/10 (${flatLabel}) - For SUP, kayaking, swimming`;
  } else {
    waveScorePill.innerHTML = `<span style="margin-right: 4px;">🏄</span> Wave: — <small>/10</small>`;
    flatScorePill.innerHTML = `<span style="margin-right: 4px;">🛟</span> Flat: — <small>/10</small>`;
  }
}

function highlightActiveButton() {
  document.querySelectorAll('.btn').forEach(btn => {
    const key = btn.dataset.key;
    const active = PLACES[currentIndex]?.key === key;
    btn.classList.toggle('active', !!active);
  });
}

function updateButtonRealtime(key) {
  const el = document.getElementById(`btn_rt_${key}`);
  const dot = document.getElementById(`btn_wp_${key}`);
  const c = currentCache[key];

  if (!el) return;

  if (!c) {
    el.textContent = '…';
    if (dot) dot.style.background = 'rgba(0,0,0,0.10)';
    return;
  }
  el.textContent = `${c.wind ?? '—'}/${c.gust ?? '—'} ${c.card ?? ''}`.trim();
  if (dot) dot.style.background = wavePeriodColor(c.waveP);
}
// v1771297632
