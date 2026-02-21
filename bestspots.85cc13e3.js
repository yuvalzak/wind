// Best wind and kite spots in the world
const BEST_SPOTS = [
  // Mediterranean
  { name: 'Tarifa, Spain', lat: 36.0136, lon: -5.6065, region: 'Europe - Mediterranean' },
  { name: 'Leucate, France', lat: 42.9097, lon: 3.0281, region: 'Europe - Mediterranean' },
  { name: 'Rhodes, Greece', lat: 36.1944, lon: 27.9694, region: 'Europe - Mediterranean' },
  { name: 'Karpathos, Greece', lat: 35.5074, lon: 27.1483, region: 'Europe - Mediterranean' },
  { name: 'Paros, Greece', lat: 37.0853, lon: 25.1489, region: 'Europe - Mediterranean' },
  { name: 'Naxos, Greece', lat: 37.1036, lon: 25.3766, region: 'Europe - Mediterranean' },
  
  // Atlantic - Europe
  { name: 'Guincho, Portugal', lat: 38.7333, lon: -9.4667, region: 'Europe - Atlantic' },
  { name: 'Essaouira, Morocco', lat: 31.5085, lon: -9.7595, region: 'Africa - Atlantic' },
  { name: 'Dakhla, Morocco', lat: 23.7147, lon: -15.9372, region: 'Africa - Atlantic' },
  
  // Red Sea & Middle East
  { name: 'Dahab, Egypt', lat: 28.5068, lon: 34.5128, region: 'Middle East - Red Sea' },
  { name: 'El Gouna, Egypt', lat: 27.3833, lon: 33.6833, region: 'Middle East - Red Sea' },
  { name: 'Aqaba, Jordan', lat: 29.5269, lon: 35.0063, region: 'Middle East - Red Sea' },
  
  // Indian Ocean
  { name: 'Zanzibar, Tanzania', lat: -6.1659, lon: 39.2026, region: 'Africa - Indian Ocean' },
  { name: 'Mauritius', lat: -20.1609, lon: 57.5012, region: 'Africa - Indian Ocean' },
  { name: 'Sri Lanka - Kalpitiya', lat: 8.2333, lon: 79.7667, region: 'Asia - Indian Ocean' },
  
  // Asia - Pacific
  { name: 'Mui Ne, Vietnam', lat: 10.9333, lon: 108.2833, region: 'Asia - Pacific' },
  { name: 'Boracay, Philippines', lat: 11.9674, lon: 121.9248, region: 'Asia - Pacific' },
  { name: 'Cabarete, Dominican Rep.', lat: 19.7500, lon: -70.4167, region: 'Caribbean' },
  
  // South America
  { name: 'Jericoacoara, Brazil', lat: -2.7928, lon: -40.5147, region: 'South America - Atlantic' },
  { name: 'Cumbuco, Brazil', lat: -3.6244, lon: -38.6850, region: 'South America - Atlantic' },
  { name: 'Punta San Carlos, Mexico', lat: 29.8167, lon: -115.9833, region: 'North America - Pacific' },
  
  // Australia & Pacific
  { name: 'Margaret River, Australia', lat: -33.9550, lon: 115.0728, region: 'Australia - Pacific' },
  { name: 'Esperance, Australia', lat: -33.8614, lon: 121.8920, region: 'Australia - Pacific' },
  
  // Africa - Atlantic
  { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241, region: 'Africa - Atlantic' },
  { name: 'Langebaan, South Africa', lat: -33.1017, lon: 18.0292, region: 'Africa - Atlantic' },
];

const addSelectedSpotsBtn = document.getElementById('addSelectedSpotsBtn');
let selectedSpots = new Set();

function groupSpotsByRegion() {
  const grouped = {};
  for (const spot of BEST_SPOTS) {
    if (!grouped[spot.region]) {
      grouped[spot.region] = [];
    }
    grouped[spot.region].push(spot);
  }
  return grouped;
}

function renderBestSpotsList() {
  const grouped = groupSpotsByRegion();
  bestSpotsList.innerHTML = '';
  
  for (const [region, spots] of Object.entries(grouped)) {
    // Region header
    const regionHeader = document.createElement('div');
    regionHeader.style.cssText = 'font-weight: bold; color: #2c3e50; margin-top: 16px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #3498db;';
    regionHeader.textContent = region;
    bestSpotsList.appendChild(regionHeader);
    
    // Spots in this region
    for (const spot of spots) {
      const spotDiv = document.createElement('div');
      spotDiv.style.cssText = 'display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
      spotDiv.onmouseenter = () => spotDiv.style.background = '#e3f2fd';
      spotDiv.onmouseleave = () => {
        spotDiv.style.background = selectedSpots.has(spot.name) ? '#c8e6c9' : '#f8f9fa';
      };
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `spot_${spot.name.replace(/[^a-z0-9]/gi, '_')}`;
      checkbox.style.cssText = 'margin-right: 12px; width: 18px; height: 18px; cursor: pointer;';
      checkbox.checked = selectedSpots.has(spot.name);
      checkbox.onchange = () => {
        if (checkbox.checked) {
          selectedSpots.add(spot.name);
          spotDiv.style.background = '#c8e6c9';
        } else {
          selectedSpots.delete(spot.name);
          spotDiv.style.background = '#f8f9fa';
        }
        addSelectedSpotsBtn.disabled = selectedSpots.size === 0;
      };
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.style.cssText = 'cursor: pointer; flex: 1; display: flex; justify-content: space-between;';
      label.innerHTML = `
        <span style="font-weight: 600; color: #2c3e50;">${spot.name}</span>
        <span style="color: #6c7a89; font-size: 0.9em;">${spot.lat.toFixed(4)}°, ${spot.lon.toFixed(4)}°</span>
      `;
      
      spotDiv.appendChild(checkbox);
      spotDiv.appendChild(label);
      bestSpotsList.appendChild(spotDiv);
      
      if (selectedSpots.has(spot.name)) {
        spotDiv.style.background = '#c8e6c9';
      }
    }
  }
}

function renderBestSpotsList() {
  const bestSpotsList = document.getElementById('bestSpotsList');
  const grouped = groupSpotsByRegion();
  bestSpotsList.innerHTML = '';
  selectedSpots.clear(); // Reset selections
  
  for (const [region, spots] of Object.entries(grouped)) {
    // Region header
    const regionHeader = document.createElement('div');
    regionHeader.style.cssText = 'font-weight: bold; color: #2c3e50; margin-top: 16px; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 2px solid #3498db;';
    regionHeader.textContent = region;
    bestSpotsList.appendChild(regionHeader);
    
    // Spots in this region
    for (const spot of spots) {
      const spotDiv = document.createElement('div');
      spotDiv.style.cssText = 'display: flex; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
      spotDiv.onmouseenter = () => spotDiv.style.background = '#e3f2fd';
      spotDiv.onmouseleave = () => {
        spotDiv.style.background = selectedSpots.has(spot.name) ? '#c8e6c9' : '#f8f9fa';
      };
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `spot_${spot.name.replace(/[^a-z0-9]/gi, '_')}`;
      checkbox.style.cssText = 'margin-right: 12px; width: 18px; height: 18px; cursor: pointer;';
      checkbox.checked = selectedSpots.has(spot.name);
      checkbox.onchange = () => {
        if (checkbox.checked) {
          selectedSpots.add(spot.name);
          spotDiv.style.background = '#c8e6c9';
        } else {
          selectedSpots.delete(spot.name);
          spotDiv.style.background = '#f8f9fa';
        }
        addSelectedSpotsBtn.disabled = selectedSpots.size === 0;
      };
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.style.cssText = 'cursor: pointer; flex: 1; display: flex; justify-content: space-between;';
      label.innerHTML = `
        <span style="font-weight: 600; color: #2c3e50;">${spot.name}</span>
        <span style="color: #6c7a89; font-size: 0.9em;">${spot.lat.toFixed(4)}°, ${spot.lon.toFixed(4)}°</span>
      `;
      
      spotDiv.appendChild(checkbox);
      spotDiv.appendChild(label);
      bestSpotsList.appendChild(spotDiv);
      
      if (selectedSpots.has(spot.name)) {
        spotDiv.style.background = '#c8e6c9';
      }
    }
  }
  
  addSelectedSpotsBtn.disabled = true;
}

addSelectedSpotsBtn.addEventListener('click', async () => {
  if (selectedSpots.size === 0) return;
  
  const places = getPlaces();
  const folderName = 'Best World Spots';
  let addedCount = 0;
  
  for (const spotName of selectedSpots) {
    const spot = BEST_SPOTS.find(s => s.name === spotName);
    if (!spot) continue;
    
    // Check if spot already exists
    const exists = places.some(p => 
      Math.abs(p.lat - spot.lat) < 0.01 && 
      Math.abs(p.lon - spot.lon) < 0.01
    );
    
    if (!exists) {
      const key = 'p_' + Date.now().toString(16) + '_' + Math.random().toString(16).slice(2);
      const sea = guessSeaForPoint(spot.lat, spot.lon);
      
      places.push({
        key,
        name: spot.name.slice(0, 28),
        lat: spot.lat,
        lon: spot.lon,
        sea,
        applyBonus: false,
        group: folderName
      });
      addedCount++;
    }
  }
  
  if (addedCount > 0) {
    savePlaces(places);
    reloadPlacesKeepSelection();
    buildFoldersUI();
    renderBestSpotsList(); // Reset the list
  }
  
  // Just do it silently - no alerts
});
