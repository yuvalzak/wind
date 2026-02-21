// Chart rendering and visualization
function buildYAxisTicks(id, yMax) {
  const ticksEl = document.getElementById(`ticks_${id}`);
  const step = 5;
  const values = [];
  for (let v = yMax; v >= 0; v -= step) values.push(v);
  ticksEl.innerHTML = values.map(v => `<div>${v}</div>`).join('');
}

function dayBlock(dayLabel, data, locName) {
  const id = idSafe(locName + '_' + dayLabel);
  window.days[id] = { dayLabel, data, locName };

  return `
    <div class="day-separator">${locName} • ${dayLabel}</div>
    <div class="day-block">
      <div class="y-axis">
        <div class="unit">kts</div>
        <div class="ticks" id="ticks_${id}"></div>
      </div>
      <div class="day-scroll">
        <div class="day-scroll-inner" id="inner_${id}">
          <div class="chart-wrapper">
            <canvas class="wind-bg" id="bg_${id}"></canvas>
            <canvas class="chart" id="c_${id}"></canvas>
          </div>
          <div class="direction-wrapper">
            <div class="direction-labels">
              <div class="dir-label wind-label">Wind</div>
              <div class="dir-label wave-label">Wave</div>
            </div>
            <div class="direction-row" id="d_${id}"></div>
          </div>
          <div class="weather-row" id="w_${id}"></div>
          <div class="time-row" id="t_${id}"></div>
        </div>
      </div>
    </div>
  `;
}

function createWindStreakAnimator(bgCanvas, cssW, cssH, dayData) {
  const ctx = sizeCanvasForDPR(bgCanvas, cssW, cssH);

  const count = Math.max(90, Math.floor(cssW * cssH / 9000));
  const streaks = [];
  for (let i = 0; i < count; i++) {
    streaks.push({ x: Math.random() * cssW, y: Math.random() * cssH, seed: Math.random() * 9999 });
  }

  let rafId = 0;
  let running = false;

  function sampleAtX(px) {
    const idx = Math.max(0, Math.min(dayData.length - 1, Math.round(px / ITEM_W)));
    return dayData[idx];
  }

  function draw() {
    if (!running) return;

    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, 0, cssW, cssH);

    for (const s of streaks) {
      const smp = sampleAtX(s.x) || { dir: 0, speed: 0, gust: 0 };

      const wind = Number(smp.speed) || 0;
      const gust = Number(smp.gust) || wind;

      const diff = Math.max(0, Math.min(25, gust - wind));
      const len = 8 + (diff / 25) * 32;

      const v = 0.4 + Math.min(35, wind) * (2.6 / 35);

      // Use the SAME angle as the arrow (no transformation)
      // Normalize direction to 0-360
      const normalizedDir = ((Number(smp.dir) % 360) + 360) % 360;
      // Use direction directly (same as arrow)
      const ang = normalizedDir * Math.PI / 180;

      // CSS rotation: 0° is UP, 90° is RIGHT, 180° is DOWN, 270° is LEFT
      // Screen coords: X increases RIGHT, Y increases DOWN
      // To convert CSS angle to screen velocity:
      const vx = Math.sin(ang) * v;     // sin gives horizontal movement
      const vy = -Math.cos(ang) * v;    // -cos gives vertical movement (negative because Y increases down)

      s.x += vx;
      s.y += vy;

      // Wrap around with better distribution
      if (s.x < -30) s.x = cssW + 30 + (Math.random() * 20 - 10);
      if (s.x > cssW + 30) s.x = -30 + (Math.random() * 20 - 10);
      if (s.y < -30) s.y = cssH + 30 + (Math.random() * 20 - 10);
      if (s.y > cssH + 30) s.y = -30 + (Math.random() * 20 - 10);

      const c = windColor(gust);

      const wobble = (Math.sin(s.seed + (s.x + s.y) * 0.01) * 0.06);
      const a2 = ang + wobble;

      ctx.save();
      ctx.globalAlpha = 0.20;
      ctx.lineWidth = 1;
      ctx.strokeStyle = c;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      // Draw line in the direction of movement (same angle as velocity)
      ctx.lineTo(s.x + Math.sin(a2) * len, s.y - Math.cos(a2) * len);
      ctx.stroke();
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, cssW, cssH);
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { start, stop };
}

function drawDay(dayObj) {
  const { dayLabel, data, locName } = dayObj;
  const id = idSafe(locName + '_' + dayLabel);

  const inner = document.getElementById(`inner_${id}`);
  const dRow = document.getElementById(`d_${id}`);
  const wRow = document.getElementById(`w_${id}`);
  const tRow = document.getElementById(`t_${id}`);

  // Calculate available width (subtract y-axis and padding)
  const scrollContainer = inner.parentElement;
  const availableWidth = scrollContainer.clientWidth - 20; // 20px for padding
  
  // Calculate item width to spread across full width
  const calculatedItemW = Math.max(ITEM_W, Math.floor(availableWidth / data.length));
  
  const totalW = calculatedItemW * data.length;
  inner.style.width = totalW + 'px';

  for (let i = 0; i < data.length; i++) {
    const o = data[i];
    
    // Wind direction (always shown)
    const normalizedWindDir = ((o.dir % 360) + 360) % 360;
    const card = degToCardinal(normalizedWindDir);
    
    // Wave direction arrow (if available)
    let waveArrow = '';
    if (typeof o.waveDir === 'number') {
      const normalizedWaveDir = ((o.waveDir % 360) + 360) % 360;
      waveArrow = `<div class="wave-arrow" style="transform:rotate(${normalizedWaveDir}deg); color:#16a085; font-size:0.9em; margin-top:2px">↓</div>`;
    }
    
    dRow.insertAdjacentHTML('beforeend', `
      <div class="direction-item" style="width:${calculatedItemW}px">
        <div class="arrow" style="transform:rotate(${normalizedWindDir}deg)">↓</div>
        <div class="cardinal">${card}</div>
        ${waveArrow}
      </div>
    `);

    // Weather (every 4 hours)
    if (i % 4 === 0) {
      const hour = o.time.getHours();
      const emoji = (typeof o.weather === 'number') ? weatherCodeToEmoji(o.weather, hour) : '';
      const temp = (typeof o.temp === 'number') ? `${Math.round(o.temp)}°` : '';
      wRow.insertAdjacentHTML('beforeend', `
        <div class="weather-item" style="width:${calculatedItemW * 4}px">
          <div class="weather-icon">${emoji}</div>
          <div class="temp-label">${temp}</div>
        </div>
      `);
    }

      // Time
    tRow.insertAdjacentHTML('beforeend', `
      <div class="time-item" style="width:${calculatedItemW}px">
        <div class="time-label">${o.time.getHours()}</div>
      </div>
    `);
  }

  const maxV = Math.max(...data.map(o => Math.max(o.speed, o.gust)));
  const yMax = Math.max(35, Math.ceil(maxV / 5) * 5);
  buildYAxisTicks(id, yMax);

  const bg = document.getElementById(`bg_${id}`);
  const c = document.getElementById(`c_${id}`);

  // Hide the background canvas (no animation)
  bg.style.display = 'none';
  
  c.style.width = totalW + 'px';
  c.style.height = CANVAS_H + 'px';
  c.width = totalW;
  c.height = CANVAS_H;

  const bandAnnotations = {
    band0: { type: 'box', yScaleID: 'y', yMin: 0, yMax: 15, backgroundColor: 'rgba(232,244,248,0.26)', borderWidth: 0 },
    band1: { type: 'box', yScaleID: 'y', yMin: 15, yMax: 20, backgroundColor: 'rgba(243,156,18,0.10)', borderWidth: 0 },
    band2: { type: 'box', yScaleID: 'y', yMin: 20, yMax: 25, backgroundColor: 'rgba(230,126,34,0.11)', borderWidth: 0 },
    band3: { type: 'box', yScaleID: 'y', yMin: 25, yMax: 30, backgroundColor: 'rgba(211,84,0,0.12)', borderWidth: 0 },
    band4: { type: 'box', yScaleID: 'y', yMin: 30, yMax: yMax, backgroundColor: 'rgba(192,57,43,0.12)', borderWidth: 0 }
  };

  const labels = data.map(o => o.time);
  const windArr = data.map(o => o.speed);
  const gustArr = data.map(o => o.gust);
  
  // Actual wind (from past observations) - show as different style
  const actualWindArr = data.map(o => (typeof o.actualWind === 'number') ? o.actualWind : null);
  
  // Actual gusts (from past observations) - for the light green shaded area
  const actualGustArr = data.map(o => (typeof o.actualWind === 'number') ? o.gust : null);

  // Wave height in KNOTS (multiply meters by 10 to use same scale as wind)
  const waveHArr = data.map(o => (typeof o.waveH === 'number' ? o.waveH * 10 : null));
  const wavePArr = data.map(o => (typeof o.waveP === 'number' ? o.waveP : NaN));
  const waveDirArr = data.map(o => (typeof o.waveDir === 'number' ? o.waveDir : null));
  const waveBarColors = data.map(o => wavePeriodColor(o.waveP));

  charts.push(new Chart(c, {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Wave',
          data: waveHArr,
          yAxisID: 'y',
          backgroundColor: waveBarColors,
          borderColor: 'rgba(0,0,0,0.12)',
          borderWidth: 1,
          barThickness: 8,
          maxBarThickness: 10
        },
        {
          type: 'line',
          label: 'Actual Gusts Area',
          data: actualGustArr,
          yAxisID: 'y',
          borderColor: 'rgba(39,174,96,0)',
          backgroundColor: 'rgba(39,174,96,0.15)',
          borderWidth: 0,
          fill: true,
          tension: 0.32,
          pointRadius: 0,
          spanGaps: false
        },
        {
          type: 'line',
          label: 'Actual Wind',
          data: actualWindArr,
          yAxisID: 'y',
          borderColor: '#27ae60',
          backgroundColor: '#27ae60',
          borderWidth: 3,
          tension: 0.32,
          pointRadius: 4,
          pointStyle: 'circle',
          borderDash: [0, 0],
          spanGaps: false
        },
        {
          type: 'line',
          label: 'Wind',
          data: windArr,
          yAxisID: 'y',
          borderWidth: 2.5,
          tension: 0.32,
          pointRadius: 3,
          segment: { borderColor: ctx => windColor(ctx.p0.parsed.y) },
          pointBackgroundColor: ctx => windColor(ctx.parsed.y)
        },
        {
          type: 'line',
          label: 'Gusts',
          data: gustArr,
          yAxisID: 'y',
          borderDash: [5, 4],
          borderWidth: 2.5,
          tension: 0.32,
          pointRadius: 3,
          borderColor: '#e53935',
          backgroundColor: '#e53935',
          segment: { borderColor: () => '#e53935' },
          pointBackgroundColor: () => '#e53935'
        }
      ]
    },
    options: {
      responsive: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            filter: (legendItem) => legendItem.text !== 'Actual Gusts Area'
          }
        },
        annotation: { annotations: bandAnnotations },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 0,
          padding: 6,
          displayColors: false,
          caretSize: 0,
          bodyFont: { size: 11, weight: 'bold' },
          bodyColor: '#000000',
          titleColor: '#000000',
          callbacks: {
            title: () => '',
            label: (ctx) => {
              // We'll build custom tooltip in beforeBody instead
              return '';
            },
            beforeBody: (tooltipItems) => {
              if (!tooltipItems || tooltipItems.length === 0) return [];
              
              const idx = tooltipItems[0].dataIndex;
              const lines = [];
              
              // Get forecast wind and gust values
              const wind = windArr[idx];
              const gust = gustArr[idx];
              
              // Get actual (measured) values
              const actualWind = actualWindArr[idx];
              const actualGust = actualGustArr[idx];
              
              // Get wave data
              const wave = waveHArr[idx];
              const wavePeriod = wavePArr[idx];
              const waveDir = waveDirArr[idx];
              
              // Line 1: Forecast windspeed / wind gusts
              if (wind != null && gust != null) {
                lines.push(`${wind}k / ${gust}k`);
              }
              
              // Line 2: Wave data (if available)
              if (wave != null) {
                const whMeters = wave / 10;
                const pTxt = isFinite(wavePeriod) ? ` ${Math.round(wavePeriod)}s` : '';
                lines.push(`🌊 ${whMeters.toFixed(1)}m${pTxt}`);
              }
              
              // Line 3: Measured windspeed / measured wind gusts (if available)
              if (actualWind != null && actualGust != null) {
                lines.push(`${actualWind}k / ${actualGust}k (measured)`);
              }
              
              return lines;
            }
          },
          itemSort: (a, b) => {
            const order = { 'Actual Wind': 0, 'Gusts': 1, 'Wind': 2, 'Wave': 3 };
            return (order[a.dataset.label] ?? 99) - (order[b.dataset.label] ?? 99);
          }
        }
      },
      scales: {
        y: { beginAtZero: true, min: 0, max: yMax, display: false },
        x: { display: false }
      }
    }
  }));
}

function renderForecast(windData, marineData, loc) {
  const h = windData.hourly;

  // Always start from TODAY (local time) so we don't show yesterday.
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const marineMap = new Map();
  if (marineData?.hourly?.time) {
    const mt = marineData.hourly.time;
    const mh = marineData.hourly.wave_height || [];
    const mp = marineData.hourly.wave_period || [];
    const md = marineData.hourly.wave_direction || [];
    for (let i = 0; i < mt.length; i++) {
      marineMap.set(mt[i], {
        waveH: (typeof mh[i] === 'number') ? mh[i] : null,
        waveP: (typeof mp[i] === 'number') ? mp[i] : null,
        waveDir: (typeof md[i] === 'number') ? md[i] : null
      });
    }
  }

  let html = '';
  let curDay = '';
  let day = [];
  window.days = {};

  for (let i = 0; i < h.time.length; i++) {
    const tStr = h.time[i];
    const t = new Date(tStr);

    // Skip anything before today's local midnight
    if (t < todayStart) continue;

    const dLabel = t.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    if (dLabel !== curDay) {
      if (day.length) html += dayBlock(curDay, day, loc.name);
      curDay = dLabel;
      day = [];
    }

    const dir = Number(h.winddirection_10m[i]);
    const rawSpeed = Number(h.windspeed_10m[i]);
    const rawGust = Number(h.windgusts_10m[i]);

    const m = marineMap.get(tStr) || { waveH: null, waveP: null };
    const rawWaveH = (typeof m.waveH === 'number') ? m.waveH : null;

    // Apply wave calibration to wave height
    const folderName = loc.group ? normalizeGroupName(loc.group) : null;
    const calibratedWaveH = rawWaveH !== null ? applyWaveCalibration(rawWaveH, loc.key, folderName) : null;

    // Apply wind calibration rules (pass wave height for conditional rules)
    const speed = applyCalibration(Math.round(rawSpeed), dir, loc.key, calibratedWaveH);
    const gust = applyCalibration(Math.round(rawGust), dir, loc.key, calibratedWaveH);
    
    const temp = (typeof h.temperature_2m[i] === 'number') ? h.temperature_2m[i] : null;
    const weather = (typeof h.weather_code[i] === 'number') ? h.weather_code[i] : null;

    // Determine if this is actual measured data (past) or forecast (future)
    const isActual = t < now;
    const actualWind = isActual ? speed : null;

    day.push({
      time: t,
      speed,
      gust,
      dir,
      waveH: calibratedWaveH,
      waveP: (typeof m.waveP === 'number') ? m.waveP : null,
      waveDir: (typeof m.waveDir === 'number') ? m.waveDir : null,
      temp,
      weather,
      actualWind
    });
  }
  if (day.length) html += dayBlock(curDay, day, loc.name);

  document.getElementById('content').innerHTML = html;

  Object.values(window.days).forEach(drawDay);
  wireScrollSync();
  scrollAllToNineAM();
  applyGoodDayHighlights();
  applyGoodDaySpotBadges();
}

function wireScrollSync() {
  const scrollers = Array.from(document.querySelectorAll('.day-scroll'));
  scrollers.forEach(sc => {
    sc.addEventListener('scroll', () => {
      if (syncingScroll) return;
      syncingScroll = true;
      const x = sc.scrollLeft;
      for (const other of scrollers) {
        if (other !== sc) other.scrollLeft = x;
      }
      syncingScroll = false;
    }, { passive: true });
  });
}

function scrollAllToNineAM() {
  const scrollers = Array.from(document.querySelectorAll('.day-scroll'));
  if (scrollers.length === 0) return;

  // Find first day with data and get actual item width from rendered elements
  const firstScroller = scrollers[0];
  const firstItem = firstScroller.querySelector('.direction-item');
  if (!firstItem) return;
  
  const itemWidth = firstItem.offsetWidth;
  
  // Check if mobile (small screen)
  const isMobile = window.innerWidth < 768;
  
  const dayEntries = Object.values(window.days || {});
  const now = new Date();
  const currentHour = now.getHours();
  
  // For mobile: scroll to current hour, for desktop: scroll to start of today
  let targetX = 0;
  let found = false;
  
  for (const day of dayEntries) {
    if (isMobile) {
      // Mobile: Find current hour in today's data
      const idx = day.data.findIndex(o => {
        const dataTime = o.time;
        return dataTime.getDate() === now.getDate() && 
               dataTime.getMonth() === now.getMonth() &&
               dataTime.getHours() === currentHour;
      });
      
      if (idx >= 0) {
        // Center the current hour on mobile
        const scrollerWidth = firstScroller.clientWidth;
        targetX = Math.max(0, (idx * itemWidth) - (scrollerWidth / 2) + (itemWidth / 2));
        found = true;
        break;
      }
    } else {
      // Desktop: Find start of today (first entry of current day)
      const idx = day.data.findIndex(o => {
        const dataTime = o.time;
        return dataTime.getDate() === now.getDate() && 
               dataTime.getMonth() === now.getMonth();
      });
      
      if (idx >= 0) {
        // Scroll to start of today
        targetX = Math.max(0, idx * itemWidth);
        found = true;
        break;
      }
    }
  }
  
  // If we didn't find today, default to 9 AM of first available day
  if (!found) {
    for (const day of dayEntries) {
      const idx = day.data.findIndex(o => o.time.getHours() === 9);
      if (idx >= 0) {
        const scrollerWidth = firstScroller.clientWidth;
        targetX = Math.max(0, (idx * itemWidth) - (scrollerWidth / 2) + (itemWidth / 2));
        break;
      }
    }
  }
  
  syncingScroll = true;
  for (const sc of scrollers) sc.scrollLeft = targetX;
  syncingScroll = false;
}

// ── Good Day highlighting ─────────────────────────────────────────────────────

// Called after forecast renders — marks day-separator elements that are good days
function applyGoodDayHighlights() {
  const prefs = getMyDayPrefs();
  // Remove all existing good-day classes first
  document.querySelectorAll('.day-separator.good-day').forEach(el => el.classList.remove('good-day'));
  if (!prefs) return;

  // window.days maps id → { dayLabel, data, locName }
  for (const dayObj of Object.values(window.days || {})) {
    if (isDayGood(prefs, dayObj.data)) {
      const id = idSafe(dayObj.locName + '_' + dayObj.dayLabel);
      // day-separator is the sibling before the day-block; find by text content match
      document.querySelectorAll('.day-separator').forEach(el => {
        if (el.textContent.includes(dayObj.locName) && el.textContent.includes(dayObj.dayLabel)) {
          el.classList.add('good-day');
        }
      });
    }
  }
}

// Called after forecast renders or spots update — marks spot buttons with good days
function applyGoodDaySpotBadges() {
  const prefs = getMyDayPrefs();
  // Remove all existing badges
  document.querySelectorAll('.btn.good-day-spot').forEach(el => el.classList.remove('good-day-spot'));
  if (!prefs) return;

  // Group days by locName to check per-spot
  const bySpot = {};
  for (const dayObj of Object.values(window.days || {})) {
    if (!bySpot[dayObj.locName]) bySpot[dayObj.locName] = [];
    bySpot[dayObj.locName].push(dayObj);
  }

  for (const [locName, days] of Object.entries(bySpot)) {
    const hasGoodDay = days.some(d => isDayGood(prefs, d.data));
    if (hasGoodDay) {
      // Find the spot button by matching PLACES name
      const loc = PLACES.find(p => p.name === locName);
      if (loc) {
        const btn = document.querySelector(`.btn[data-key="${loc.key}"]`);
        if (btn) btn.classList.add('good-day-spot');
      }
    }
  }
}
