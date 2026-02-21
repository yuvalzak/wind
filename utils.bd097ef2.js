// Utility and helper functions
function windColor(v) {
  if (v < 15) return '#3498db';
  if (v < 20) return '#f39c12';
  if (v < 25) return '#e67e22';
  if (v < 30) return '#d35400';
  return '#c0392b';
}

function wavePeriodColor(p) {
  if (!isFinite(p)) return 'rgba(0,0,0,0.10)';
  if (p < 5) return '#c0392b';
  if (p < 7) return '#e67e22';
  if (p < 9) return '#f39c12';
  if (p < 12) return '#7fb3d5';
  return '#3498db';
}

function degToCardinal(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return dirs[i];
}

function weatherCodeToEmoji(code, hour) {
  // Use moon icons for night time (0-5, 20-23)
  const isNight = hour < 6 || hour >= 20;
  
  // WMO Weather interpretation codes
  if (code === 0) return isNight ? '🌙' : '☀️'; // Clear sky / Clear night
  if (code === 1) return isNight ? '🌙' : '🌤️'; // Mainly clear
  if (code === 2) return isNight ? '🌙' : '⛅'; // Partly cloudy
  if (code === 3) return '☁️'; // Overcast (same day/night)
  if (code >= 45 && code <= 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 57) return '🌧️'; // Drizzle
  if (code >= 61 && code <= 67) return '🌧️'; // Rain
  if (code >= 71 && code <= 77) return '🌨️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
  if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
  if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
  return isNight ? '🌙' : '🌤️'; // Default
}

function guessSeaForPoint(lat, lon) {
  if (lat > 32.70 && lat < 33.05 && lon > 35.45 && lon < 35.70) return 'lake';
  if (lat > 31.0 && lat < 33.5 && lon > 34.15 && lon < 35.10) return 'med';
  return 'custom';
}

function buildForecastPoint(place) {
  return { lat: place.lat, lon: place.lon };
}

function buildWindUrl(lat, lon) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m,weather_code,visibility,cloud_cover,lightning_potential` +
    `&current=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m,weather_code,visibility,cloud_cover,lightning_potential` +
    `&windspeed_unit=kn&timezone=Asia/Jerusalem&forecast_days=7&past_days=1&models=icon_global`;
}

function buildMarineUrl(lat, lon) {
  return `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
    `&hourly=wave_height,wave_period,wave_direction` +
    `&current=wave_height,wave_period,wave_direction` +
    `&timezone=Asia/Jerusalem&forecast_days=7`;
}

function buildAirQualityUrl(lat, lon) {
  return `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
    `&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
    `&timezone=Asia/Jerusalem`;
}

function getAQIColor(aqi) {
  if (aqi <= 20) return '#50f0e6'; // Good
  if (aqi <= 40) return '#50ccaa'; // Fair
  if (aqi <= 60) return '#f0e641'; // Moderate
  if (aqi <= 80) return '#ff5050'; // Poor
  if (aqi <= 100) return '#960032'; // Very Poor
  return '#7d2181'; // Extremely Poor
}

function getAQILabel(aqi) {
  if (aqi <= 20) return 'Good';
  if (aqi <= 40) return 'Fair';
  if (aqi <= 60) return 'Moderate';
  if (aqi <= 80) return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Extreme';
}

function getAQIDescription(aqi) {
  if (aqi <= 20) return 'Air quality is good. Ideal for outdoor activities.';
  if (aqi <= 40) return 'Air quality is fair. Acceptable for most people.';
  if (aqi <= 60) return 'Air quality is moderate. Sensitive individuals may experience minor issues.';
  if (aqi <= 80) return 'Air quality is poor. May cause breathing discomfort to some.';
  if (aqi <= 100) return 'Air quality is very poor. Sensitive groups should limit outdoor exposure.';
  return 'Air quality is extremely poor. Everyone should avoid prolonged outdoor exposure.';
}

function idSafe(s) {
  return s.replace(/[^a-z0-9]/gi, '_');
}

function sizeCanvasForDPR(canvas, cssW, cssH) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  const ctx = canvas.getContext('2d', { alpha: true });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// Apply calibration to wind data
function applyCalibration(windSpeed, windDir, spotKey, waveHeight = null) {
  const rules = getCalibrationRules(spotKey);
  if (rules.length === 0) return windSpeed;
  
  let adjusted = windSpeed;
  
  // Normalize direction to 0-360
  const dir = ((windDir % 360) + 360) % 360;
  // Find sector (16 sectors)
  const sector = Math.floor(dir / 22.5) % 16;
  
  for (const rule of rules) {
    if (rule.sectors.includes(sector)) {
      // Check wave condition if present
      if (rule.waveCondition && waveHeight !== null) {
        const meetsCondition = rule.waveCondition.type === 'less'
          ? waveHeight < rule.waveCondition.threshold
          : waveHeight > rule.waveCondition.threshold;
        
        if (!meetsCondition) {
          continue; // Skip this rule if wave condition not met
        }
      }
      
      if (rule.type === 'knots') {
        adjusted += rule.value;
      } else {
        adjusted *= (1 + rule.value / 100);
      }
    }
  }
  
  return Math.round(adjusted);
}

// Sea Quality Scoring for Wave Riding (1-10 scale)
// High waves + long period = good
// Short period = choppy/bad
function calculateWaveRidingScore(waveHeight, wavePeriod) {
  if (!waveHeight || !wavePeriod || waveHeight <= 0 || wavePeriod <= 0) return 0;
  const score = (waveHeight * wavePeriod) / 2.5;
  return Math.min(10, Math.max(0, score)).toFixed(1);
}

// Sea Quality Scoring for Flat Water (1-10 scale)
// Small waves + long period = good (smooth)
// Large waves or short period = choppy/bad
function calculateFlatWaterScore(waveHeight, wavePeriod) {
  if (!wavePeriod || wavePeriod <= 0) return 0;
  const score = (wavePeriod * wavePeriod) / ((waveHeight + 0.2) * 5);
  return Math.min(10, Math.max(0, score)).toFixed(1);
}

// Get descriptive label for sea quality score
function getSeaQualityLabel(score) {
  score = parseFloat(score);
  if (score >= 9) return 'Epic';
  if (score >= 7) return 'Excellent';
  if (score >= 5) return 'Good';
  if (score >= 3) return 'Fair';
  if (score >= 1) return 'Poor';
  return 'Very Poor';
}

// Get color for sea quality score
function getSeaQualityColor(score) {
  score = parseFloat(score);
  if (score >= 9) return '#27ae60';
  if (score >= 7) return '#2ecc71';
  if (score >= 5) return '#f39c12';
  if (score >= 3) return '#e67e22';
  return '#c0392b';
}

// Apply wave calibration to wave height
// Returns calibrated wave height
function applyWaveCalibration(waveHeight, spotKey, folderName) {
  if (!waveHeight || waveHeight <= 0) return waveHeight;
  
  // Check if spot has its own calibration rules - if yes, skip folder calibration
  const spotRules = getCalibrationRules(spotKey);
  if (spotRules && spotRules.length > 0) {
    // Spot has its own wind calibration, don't apply folder wave calibration
    return waveHeight;
  }
  
  // Get folder wave calibration
  const folderCal = getFolderWaveCalibration(folderName);
  if (!folderCal) return waveHeight;
  
  let calibrated = waveHeight;
  
  // Apply small wave adjustment (for waves <= threshold)
  if (folderCal.smallWaveThreshold && waveHeight <= folderCal.smallWaveThreshold) {
    if (folderCal.smallWaveType === 'percent') {
      calibrated = waveHeight * (1 + folderCal.smallWaveValue / 100);
    } else {
      // meters
      calibrated = waveHeight + folderCal.smallWaveValue;
    }
  }
  // Apply large wave adjustment (for waves > threshold)
  else if (folderCal.largeWaveThreshold && waveHeight > folderCal.largeWaveThreshold) {
    if (folderCal.largeWaveType === 'percent') {
      calibrated = waveHeight * (1 + folderCal.largeWaveValue / 100);
    } else {
      // meters
      calibrated = waveHeight + folderCal.largeWaveValue;
    }
  }
  
  // Don't allow negative wave heights
  return Math.max(0, calibrated);
}
// v1771297632
