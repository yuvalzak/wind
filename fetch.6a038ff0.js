// Data fetching and API calls
async function refreshRealtimeForAllButtons() {
  const token = ++currentFetchToken;
  PLACES.forEach(loc => updateButtonRealtime(loc.key));

  await Promise.allSettled(
    PLACES.map(async (loc) => {
      try {
        const wr = await fetch(buildWindUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' });
        if (!wr.ok) throw new Error('wind');
        const wj = await wr.json();
        const wc = wj.current;
        if (!wc || typeof wc.windspeed_10m !== 'number') throw new Error('no wind current');

        let dir = Number(wc.winddirection_10m);
        let wind = Math.round(Number(wc.windspeed_10m));
        let gust = Math.round(Number(wc.windgusts_10m));

        const card = degToCardinal(dir);
        const timeStr = wj.current?.time
          ? (() => {
              const t = new Date(wj.current.time);
              const h = t.getHours();
              const m = t.getMinutes();
              return m === 0 ? `${h}h` : `${h}:${m.toString().padStart(2, '0')}`;
            })()
          : '';
        
        const airTemp = (typeof wc.temperature_2m === 'number') ? Math.round(wc.temperature_2m) : null;
        const visibility = (typeof wc.visibility === 'number') ? (wc.visibility / 1000).toFixed(1) : null;
        const cloudCover = (typeof wc.cloud_cover === 'number') ? Math.round(wc.cloud_cover) : null;
        const lightning = (typeof wc.lightning_potential === 'number') ? Math.round(wc.lightning_potential) : null;

        // Extract today's sunrise/sunset from daily data
        let sunrise = null, sunset = null;
        try {
          const today = new Date().toISOString().slice(0, 10);
          const dailyTimes = wj.daily?.time || [];
          const todayIdx = dailyTimes.findIndex(t => t === today);
          if (todayIdx >= 0) {
            const srRaw = wj.daily.sunrise?.[todayIdx];
            const ssRaw = wj.daily.sunset?.[todayIdx];
            if (srRaw) sunrise = srRaw.slice(11, 16); // "HH:MM"
            if (ssRaw) sunset  = ssRaw.slice(11, 16);
          }
        } catch {}

        let waveH = null, waveP = null, waveDir = null, waterTemp = null;
        try {
          const mr = await fetch(buildMarineUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' });
          if (mr.ok) {
            const mj = await mr.json();
            const mc = mj.current;
            if (mc && typeof mc.wave_height === 'number') waveH = Number(mc.wave_height).toFixed(1);
            if (mc && typeof mc.wave_period === 'number') waveP = Math.round(Number(mc.wave_period));
            if (mc && typeof mc.wave_direction === 'number') waveDir = Math.round(Number(mc.wave_direction));
            if (mc && typeof mc.sea_surface_temperature === 'number') waterTemp = Math.round(mc.sea_surface_temperature);
          }
        } catch {}

        // Apply wave calibration once here — calibrated value used everywhere
        const folderName = loc.group ? normalizeGroupName(loc.group) : null;
        const rawWaveHeight = waveH ? parseFloat(waveH) : null;
        const calibratedWaveH = rawWaveHeight !== null ? applyWaveCalibration(rawWaveHeight, loc.key, folderName) : null;
        if (calibratedWaveH !== null) waveH = calibratedWaveH.toFixed(1);

        // Apply wind calibration using calibrated wave height for conditional rules
        wind = applyCalibration(wind, dir, loc.key, calibratedWaveH);
        gust = applyCalibration(gust, dir, loc.key, calibratedWaveH);

        // Fetch air quality data
        let aqi = null;
        try {
          const aqr = await fetch(buildAirQualityUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' });
          if (aqr.ok) {
            const aqj = await aqr.json();
            const aqc = aqj.current;
            if (aqc && typeof aqc.european_aqi === 'number') {
              aqi = Math.round(aqc.european_aqi);
            }
          }
        } catch {}

        if (token !== currentFetchToken) return;

        currentCache[loc.key] = { wind, gust, dir: Math.round(dir), card, timeStr, waveH, waveP, waveDir, airTemp, waterTemp, aqi, visibility, cloudCover, lightning, sunrise, sunset };
        updateButtonRealtime(loc.key);
        if (PLACES[currentIndex]?.key === loc.key) renderSelectedNowFromCache();
      } catch {
        if (token !== currentFetchToken) return;
        if (!currentCache[loc.key]) {
          currentCache[loc.key] = { wind: '—', gust: '—', dir: '—', card: '—', timeStr: '', waveH: '—', waveP: NaN, waveDir: '—', airTemp: '—', waterTemp: '—', aqi: null, visibility: '—', cloudCover: '—', lightning: null };
        }
        updateButtonRealtime(loc.key);
        if (PLACES[currentIndex]?.key === loc.key) setNowBarUnavailable();
      }
    })
  );
  
  // Update best wind indicators after all data is fetched
  updateFolderBestWindBadges();
  updateSpotBestWindHighlight();
}

async function loadForecastForSelected() {
  for (const anim of windAnimByCanvasId.values()) {
    try {
      anim.stop();
    } catch {}
  }
  windAnimByCanvasId.clear();

  charts.forEach(c => {
    try {
      c.destroy();
    } catch {}
  });
  charts.length = 0;

  setNowBarLoading();
  document.getElementById('content').innerHTML = `<div class="loading">Loading…</div>`;

  const loc = PLACES[currentIndex];
  if (!loc) {
    return;
  }

  try {
    const [wr, mr, aqr] = await Promise.all([
      fetch(buildWindUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' }),
      fetch(buildMarineUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' }),
      fetch(buildAirQualityUrl(loc.forecastLat, loc.forecastLon), { cache: 'no-store' })
    ]);

    if (!wr.ok) throw new Error('wind');
    const windData = await wr.json();

    let marineData = null;
    if (mr.ok) marineData = await mr.json();

    let airQualityData = null;
    if (aqr.ok) airQualityData = await aqr.json();

    try {
      const wc = windData.current;
      if (wc && typeof wc.windspeed_10m === 'number') {
        let dir = Number(wc.winddirection_10m);
        let wind = Math.round(Number(wc.windspeed_10m));
        let gust = Math.round(Number(wc.windgusts_10m));

        const airTemp = (typeof wc.temperature_2m === 'number') ? Math.round(wc.temperature_2m) : null;
        const visibility = (typeof wc.visibility === 'number') ? (wc.visibility / 1000).toFixed(1) : null;
        const cloudCover = (typeof wc.cloud_cover === 'number') ? Math.round(wc.cloud_cover) : null;
        const lightning = (typeof wc.lightning_potential === 'number') ? Math.round(wc.lightning_potential) : null;

        // Extract today's sunrise/sunset from daily data
        let sunrise = null, sunset = null;
        try {
          const today = new Date().toISOString().slice(0, 10);
          const dailyTimes = windData.daily?.time || [];
          const todayIdx = dailyTimes.findIndex(t => t === today);
          if (todayIdx >= 0) {
            const srRaw = windData.daily.sunrise?.[todayIdx];
            const ssRaw = windData.daily.sunset?.[todayIdx];
            if (srRaw) sunrise = srRaw.slice(11, 16);
            if (ssRaw) sunset  = ssRaw.slice(11, 16);
          }
        } catch {}

        let waveH = null, waveP = null, waveDir = null, waterTemp = null;
        const mc = marineData?.current;
        if (mc && typeof mc.wave_height === 'number') waveH = Number(mc.wave_height).toFixed(1);
        if (mc && typeof mc.wave_period === 'number') waveP = Math.round(Number(mc.wave_period));
        if (mc && typeof mc.wave_direction === 'number') waveDir = Math.round(Number(mc.wave_direction));
        if (mc && typeof mc.sea_surface_temperature === 'number') waterTemp = Math.round(mc.sea_surface_temperature);

        // Apply wave calibration once here — calibrated value used everywhere
        const folderName = loc.group ? normalizeGroupName(loc.group) : null;
        const rawWaveHeight = waveH ? parseFloat(waveH) : null;
        const calibratedWaveH = rawWaveHeight !== null ? applyWaveCalibration(rawWaveHeight, loc.key, folderName) : null;
        if (calibratedWaveH !== null) waveH = calibratedWaveH.toFixed(1);

        // Apply wind calibration using calibrated wave height for conditional rules
        wind = applyCalibration(wind, dir, loc.key, calibratedWaveH);
        gust = applyCalibration(gust, dir, loc.key, calibratedWaveH);

        let aqi = null;
        const aqc = airQualityData?.current;
        if (aqc && typeof aqc.european_aqi === 'number') {
          aqi = Math.round(aqc.european_aqi);
        }

        currentCache[loc.key] = {
          wind, gust,
          dir: Math.round(dir),
          card: degToCardinal(dir),
          timeStr: windData.current?.time
            ? (() => {
                const t = new Date(windData.current.time);
                const h = t.getHours();
                const m = t.getMinutes();
                return m === 0 ? `${h}h` : `${h}:${m.toString().padStart(2, '0')}`;
              })()
            : '',
          waveH, waveP, waveDir, airTemp, waterTemp, aqi, visibility, cloudCover, lightning, sunrise, sunset
        };
        updateButtonRealtime(loc.key);
        renderSelectedNowFromCache();
      } else {
        setNowBarUnavailable();
      }
    } catch {
      setNowBarUnavailable();
    }

    renderForecast(windData, marineData, loc);
  } catch (e) {
    document.getElementById('content').innerHTML =
      `<div class="error">❌ Failed to load forecast.<br><br>
       If your browser blocks requests from <b>file://</b>, run:<br>
       <code>python -m http.server 8000</code><br>
       then open: <code>http://localhost:8000/yourfile.html</code></div>`;
    setNowBarUnavailable();
  }
}
// v1771297632
