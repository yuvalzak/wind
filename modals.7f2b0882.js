const mapBackdrop=document.getElementById('mapBackdrop');
const openMapBtn=document.getElementById('openMapBtn');
const closeMapBtn=document.getElementById('closeMapBtn');
const savePointBtn=document.getElementById('savePointBtn');
const pickedCoordsEl=document.getElementById('pickedCoords');
const placeNameEl=document.getElementById('placeName');
const folderSelectEl=document.getElementById('folderSelect');
const newFolderInputEl=document.getElementById('newFolderInput');
const mapSearchEl=document.getElementById('mapSearch');
const mapSearchBtn=document.getElementById('mapSearchBtn');
const useMyLocationBtn=document.getElementById('useMyLocationBtn');
const searchSuggestionsEl=document.getElementById('searchSuggestions');
let map,marker,pickedLat=null,pickedLon=null;
let mapInitialized=false;
let currentSpotMarker=null;
let searchTimeout=null;
function populateFolderSelect(selectEl,preferred){
const groups=getAllGroups();
selectEl.innerHTML='';
for(const g of groups){
const opt=document.createElement('option');
opt.value=g;
opt.textContent=g;
selectEl.appendChild(opt);
}
const pref=normalizeGroupName(preferred||'Ungrouped');
selectEl.value=groups.includes(pref)?pref:'Ungrouped';
}
async function showSearchSuggestions(query){
if(!query||query.trim().length<2){
searchSuggestionsEl.classList.remove('active');
searchSuggestionsEl.innerHTML='';
return;
}
try{
const userLang=navigator.language||navigator.userLanguage||'en';
const langCode=userLang.split('-')[0];
const response=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=${langCode}`);
const results=await response.json();
if(results.length===0){
searchSuggestionsEl.innerHTML='<div class="search-suggestion-item" style="color:#6c7a89;cursor:default;">No locations found. Try a different search term.</div>';
searchSuggestionsEl.classList.add('active');
return;
}
searchSuggestionsEl.innerHTML='';
for(const result of results){
const item=document.createElement('div');
item.className='search-suggestion-item';
const nameEl=document.createElement('div');
nameEl.className='search-suggestion-name';
nameEl.textContent=result.display_name.split(',')[0];
const detailEl=document.createElement('div');
detailEl.className='search-suggestion-detail';
detailEl.textContent=result.display_name;
item.appendChild(nameEl);
item.appendChild(detailEl);
item.addEventListener('click',()=>{
selectSearchResult(result);
});
searchSuggestionsEl.appendChild(item);
}
searchSuggestionsEl.classList.add('active');
}catch(error){
console.error('Search error:',error);
searchSuggestionsEl.innerHTML='<div class="search-suggestion-item" style="color:#e74c3c;cursor:default;">Search failed. Please try again.</div>';
searchSuggestionsEl.classList.add('active');
}
}
function selectSearchResult(result){
const lat=parseFloat(result.lat);
const lon=parseFloat(result.lon);
map.setView([lat,lon],12);
pickedLat=lat;
pickedLon=lon;
if(!marker)marker=L.marker([lat,lon]).addTo(map);
else marker.setLatLng([lat,lon]);
pickedCoordsEl.textContent=`Lat/Lon:${lat.toFixed(5)},${lon.toFixed(5)}`;
savePointBtn.disabled=false;
if(result.display_name){
const parts=result.display_name.split(',');
placeNameEl.value=parts[0].trim();
}
searchSuggestionsEl.classList.remove('active');
searchSuggestionsEl.innerHTML='';
placeNameEl.focus();
}
async function searchLocation(){
const query=mapSearchEl.value.trim();
if(!query)return;
try{
const userLang=navigator.language||navigator.userLanguage||'en';
const langCode=userLang.split('-')[0];
const response=await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=${langCode}`);
const results=await response.json();
if(results.length>0){
selectSearchResult(results[0]);
}else{
showSearchSuggestions(query);
}
}catch(error){
console.error('Search error:',error);
searchSuggestionsEl.innerHTML='<div class="search-suggestion-item" style="color:#e74c3c;cursor:default;">Search failed. Please try again.</div>';
searchSuggestionsEl.classList.add('active');
}
}
mapSearchEl.addEventListener('input',(e)=>{
clearTimeout(searchTimeout);
const query=e.target.value.trim();
if(query.length<2){
searchSuggestionsEl.classList.remove('active');
searchSuggestionsEl.innerHTML='';
return;
}
searchTimeout=setTimeout(()=>{
showSearchSuggestions(query);
},300);
});
document.addEventListener('click',(e)=>{
if(!mapSearchEl.contains(e.target)&&!searchSuggestionsEl.contains(e.target)){
searchSuggestionsEl.classList.remove('active');
}
});
function clearSearchSuggestions(){
searchSuggestionsEl.classList.remove('active');
searchSuggestionsEl.innerHTML='';
clearTimeout(searchTimeout);
}
mapSearchBtn.addEventListener('click',searchLocation);
mapSearchEl.addEventListener('keypress',(e)=>{
if(e.key==='Enter'){
searchLocation();
}
});
async function useMyLocation(){
if(!navigator.geolocation){
alert('Geolocation is not supported by your browser');
return;
}
const originalText=useMyLocationBtn.textContent;
useMyLocationBtn.disabled=true;
useMyLocationBtn.textContent='⏳ Getting location...';
const options={
enableHighAccuracy:false,
timeout:15000,
maximumAge:10000
};
navigator.geolocation.getCurrentPosition(
async(position)=>{
const lat=position.coords.latitude;
const lon=position.coords.longitude;
map.setView([lat,lon],14);
pickedLat=lat;
pickedLon=lon;
if(!marker)marker=L.marker([lat,lon]).addTo(map);
else marker.setLatLng([lat,lon]);
pickedCoordsEl.textContent=`Lat/Lon:${lat.toFixed(5)},${lon.toFixed(5)}`;
savePointBtn.disabled=false;
try{
const userLang=navigator.language||navigator.userLanguage||'en';
const langCode=userLang.split('-')[0];
const response=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${langCode}`);
const result=await response.json();
if(result&&result.address){
const addr=result.address;
const placeName=addr.suburb||addr.village||addr.town||addr.city||addr.state||'My Location';
placeNameEl.value=placeName;
}else{
placeNameEl.value='My Location';
}
}catch(error){
console.error('Reverse geocoding error:',error);
placeNameEl.value='My Location';
}
placeNameEl.focus();
useMyLocationBtn.disabled=false;
useMyLocationBtn.textContent=originalText;
},
(error)=>{
console.error('Geolocation error:',error);
let errorMsg='Could not get your location';
switch(error.code){
case error.PERMISSION_DENIED:
errorMsg='Location permission denied. Please enable location access in your browser settings.\n\nOn Android:Settings>Site Settings>Location>Allow';
break;
case error.POSITION_UNAVAILABLE:
errorMsg='Location information unavailable. Make sure GPS/Location is enabled on your device.\n\nOn Android:Settings>Location>Turn On';
break;
case error.TIMEOUT:
errorMsg='Location request timed out. Please try again or use the map search instead.';
break;
}
alert(errorMsg);
useMyLocationBtn.disabled=false;
useMyLocationBtn.textContent=originalText;
},
options
);
}
useMyLocationBtn.addEventListener('click',useMyLocation);
function openMap(){
mapBackdrop.style.display='flex';
mapBackdrop.setAttribute('aria-hidden','false');
const loc=PLACES[currentIndex];
const isEditMode=window.isEditingSpot&&window.editingSpotKey===loc?.key;
const mapModalTitle=document.getElementById('mapModalTitle');
const mapModalHint=document.getElementById('mapModalHint');
if(isEditMode&&loc){
mapModalTitle.textContent=`Edit:${loc.name}`;
document.getElementById('mapModalHint').style.display='none';
}else{
mapModalTitle.textContent='Pick a location';
const hintEl=document.getElementById('mapModalHint');
hintEl.style.display='';
hintEl.textContent='Click map → name it → choose folder → Save';
}
if(isEditMode&&loc){
placeNameEl.value=loc.name;
populateFolderSelect(folderSelectEl,loc.group||'Ungrouped');
pickedLat=loc.lat;
pickedLon=loc.lon;
pickedCoordsEl.textContent=`Lat/Lon:${loc.lat.toFixed(5)},${loc.lon.toFixed(5)}`;
savePointBtn.disabled=false;
savePointBtn.textContent='Update Location';
}else{
populateFolderSelect(folderSelectEl,getLastFolder()||'Ungrouped');
placeNameEl.value='';
newFolderInputEl.value='';
savePointBtn.textContent='Save Spot';
savePointBtn.disabled=true;
window.isEditingSpot=false;
window.editingSpotKey=null;
}
if(!mapInitialized){
mapInitialized=true;
const defaultLat=loc?loc.lat:31.7;
const defaultLon=loc?loc.lon:34.9;
const defaultZoom=loc?12:8;
map=L.map('map',{center:[defaultLat,defaultLon],zoom:defaultZoom,minZoom:2,maxZoom:18});
const userLang=navigator.language||navigator.userLanguage||'en';
const langCode=userLang.split('-')[0];
const streetLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{
attribution:'Tiles © Esri',
maxZoom:18
});
const satelliteLayer=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
attribution:'Tiles © Esri',
maxZoom:18
});
const labelsLayer=L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',{
attribution:'© CARTO',
subdomains:'abcd',
maxZoom:19,
pane:'labels'
});
map.createPane('labels');
map.getPane('labels').style.zIndex=650;
map.getPane('labels').style.pointerEvents='none';
streetLayer.addTo(map);
labelsLayer.addTo(map);
const baseLayers={
"🛰️ Satellite":satelliteLayer,
"🗺️ Street Map":streetLayer
};
const overlays={
"🏷️ Labels":labelsLayer
};
L.control.layers(baseLayers,overlays,{position:'topright'}).addTo(map);
map.on('click',(e)=>{
pickedLat=e.latlng.lat;
pickedLon=e.latlng.lng;
if(!marker)marker=L.marker([pickedLat,pickedLon]).addTo(map);
else marker.setLatLng([pickedLat,pickedLon]);
pickedCoordsEl.textContent=`Lat/Lon:${pickedLat.toFixed(5)},${pickedLon.toFixed(5)}`;
savePointBtn.disabled=false;
if(!window.isEditingSpot){
savePointBtn.textContent='Save Spot';
window.editingSpotKey=null;
}
placeNameEl.focus();
});
setTimeout(()=>map.invalidateSize(),120);
}else{
if(isEditMode&&loc){
map.setView([loc.lat,loc.lon],12);
}else if(loc){
map.setView([loc.lat,loc.lon],12);
}else{
map.setView([31.7,34.9],8);
}
setTimeout(()=>map.invalidateSize(),120);
}
if(loc){
const blueIcon=L.icon({
iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
iconSize:[25,41],
iconAnchor:[12,41],
popupAnchor:[1,-34],
shadowSize:[41,41]
});
if(currentSpotMarker){
currentSpotMarker.setLatLng([loc.lat,loc.lon]);
}else{
currentSpotMarker=L.marker([loc.lat,loc.lon],{icon:blueIcon,draggable:true}).addTo(map);
currentSpotMarker.on('dragend',function(e){
const currentLoc=PLACES[currentIndex];
if(!currentLoc)return;
const newPos=e.target.getLatLng();
pickedLat=newPos.lat;
pickedLon=newPos.lng;
window.isEditingSpot=true;
window.editingSpotKey=currentLoc.key;
if(marker)marker.setLatLng([pickedLat,pickedLon]);
else marker=L.marker([pickedLat,pickedLon]).addTo(map);
pickedCoordsEl.textContent=`Lat/Lon:${pickedLat.toFixed(5)},${pickedLon.toFixed(5)}`;
placeNameEl.value=currentLoc.name;
folderSelectEl.value=currentLoc.group||'Ungrouped';
savePointBtn.disabled=false;
savePointBtn.textContent='Update Location';
placeNameEl.focus();
});
currentSpotMarker.on('click',function(e){
const currentLoc=PLACES[currentIndex];
if(!currentLoc)return;
const pos=e.target.getLatLng();
pickedLat=pos.lat;
pickedLon=pos.lng;
window.isEditingSpot=true;
window.editingSpotKey=currentLoc.key;
if(marker)marker.setLatLng([pickedLat,pickedLon]);
else marker=L.marker([pickedLat,pickedLon]).addTo(map);
pickedCoordsEl.textContent=`Lat/Lon:${pickedLat.toFixed(5)},${pickedLon.toFixed(5)}`;
placeNameEl.value=currentLoc.name;
folderSelectEl.value=currentLoc.group||'Ungrouped';
savePointBtn.disabled=false;
savePointBtn.textContent='Update Location';
placeNameEl.focus();
});
currentSpotMarker.on('click',function(e){
const currentLoc=PLACES[currentIndex];
const pos=e.target.getLatLng();
pickedLat=pos.lat;
pickedLon=pos.lng;
if(marker)marker.setLatLng([pickedLat,pickedLon]);
else marker=L.marker([pickedLat,pickedLon]).addTo(map);
pickedCoordsEl.textContent=`Lat/Lon:${pickedLat.toFixed(5)},${pickedLon.toFixed(5)}`;
placeNameEl.value=currentLoc?currentLoc.name:'';
folderSelectEl.value=currentLoc?(currentLoc.group||'Ungrouped'):'Ungrouped';
savePointBtn.disabled=false;
savePointBtn.textContent='Update Location';
placeNameEl.focus();
});
}
if(!isEditMode){
currentSpotMarker.bindPopup(`<b>${loc.name}</b><br>Current spot location`);
}
if(isEditMode){
if(marker)marker.setLatLng([loc.lat,loc.lon]);
else marker=L.marker([loc.lat,loc.lon]).addTo(map);
}
}
}
function closeMap(){
mapBackdrop.style.display='none';
mapBackdrop.setAttribute('aria-hidden','true');
window.isEditingSpot=false;
window.editingSpotKey=null;
clearSearchSuggestions();
}
openMapBtn.addEventListener('click',openMap);
closeMapBtn.addEventListener('click',closeMap);
const closeMapBtn2=document.getElementById('closeMapBtn2');
if(closeMapBtn2){
closeMapBtn2.addEventListener('click',closeMap);
}
mapBackdrop.addEventListener('click',(e)=>{
if(e.target===mapBackdrop)closeMap();
});
savePointBtn.addEventListener('click',async()=>{
if(pickedLat==null||pickedLon==null)return;
const name=(placeNameEl.value||'').trim()||'Saved Place';
const sea=guessSeaForPoint(pickedLat,pickedLon);
const newFolderName=(newFolderInputEl.value||'').trim();
let group;
if(newFolderName){
group=normalizeGroupName(newFolderName);
}else{
group=normalizeGroupName(folderSelectEl.value||'Ungrouped');
}
setLastFolder(group);
const places=getPlaces();
const editKey=window.editingSpotKey;
const isUpdate=window.isEditingSpot&&!!editKey;
if(isUpdate){
const placeIdx=places.findIndex(p=>p.key===editKey);
if(placeIdx>=0){
places[placeIdx].lat=pickedLat;
places[placeIdx].lon=pickedLon;
places[placeIdx].name=name.slice(0,28);
places[placeIdx].sea=sea;
places[placeIdx].group=group;
}
savePlaces(places);
reloadPlacesKeepSelection();
buildFoldersUI();
}else{
const key='p_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2);
places.push({key,name:name.slice(0,28),lat:pickedLat,lon:pickedLon,sea,applyBonus:false,group});
savePlaces(places);
reloadPlacesKeepSelection();
const newIdx=PLACES.findIndex(p=>p.key===key);
currentIndex=(newIdx>=0)?newIdx:0;
setLastSelectedKey(PLACES[currentIndex]?.key||'');
buildFoldersUI();
}
window.isEditingSpot=false;
window.editingSpotKey=null;
placeNameEl.value='';
mapSearchEl.value='';
newFolderInputEl.value='';
savePointBtn.disabled=true;
savePointBtn.textContent='Save Spot';
closeMap();
setHeader();
refreshSelectedPanel();
await loadForecastForSelected();
await refreshRealtimeForAllButtons();
});
const latInput=document.getElementById('latInput');
const lonInput=document.getElementById('lonInput');
const goToLatLonBtn=document.getElementById('goToLatLonBtn');
function goToLatLon(){
const lat=parseFloat(latInput.value);
const lon=parseFloat(lonInput.value);
if(isNaN(lat)||isNaN(lon)||lat<-90||lat>90||lon<-180||lon>180){
latInput.style.borderColor='#e74c3c';
lonInput.style.borderColor='#e74c3c';
setTimeout(()=>{latInput.style.borderColor='';lonInput.style.borderColor='';},1500);
return;
}
map.setView([lat,lon],13);
pickedLat=lat;
pickedLon=lon;
if(!marker)marker=L.marker([lat,lon]).addTo(map);
else marker.setLatLng([lat,lon]);
pickedCoordsEl.textContent=`Lat/Lon:${lat.toFixed(5)},${lon.toFixed(5)}`;
savePointBtn.disabled=false;
if(document.getElementById('placeName').value===''){
document.getElementById('placeName').focus();
}
}
goToLatLonBtn.addEventListener('click',goToLatLon);
[latInput,lonInput].forEach(inp=>{
inp.addEventListener('keydown',(e)=>{if(e.key==='Enter')goToLatLon();});
});