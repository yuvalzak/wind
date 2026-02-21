let PLACES=[];
let currentIndex=0;
const currentCache={};
let currentFetchToken=0;
const charts=[];
let syncingScroll=false;
const windAnimByCanvasId=new Map();
function reloadPlacesKeepSelection(){
const lastKey=PLACES[currentIndex]?.key||getLastSelectedKey();
PLACES=sortPlaces(getPlaces()).map(p=>{
const fp=buildForecastPoint(p);
return{...p,forecastLat:fp.lat,forecastLon:fp.lon};
});
let idx=PLACES.findIndex(p=>p.key===lastKey);
if(idx<0)idx=0;
currentIndex=Math.max(0,Math.min(idx,PLACES.length-1));
if(PLACES[currentIndex])setLastSelectedKey(PLACES[currentIndex].key);
}
function setHeader(){
const loc=PLACES[currentIndex];
const titleEl=document.getElementById('title');
const iconHtml='<img src="windgod_banner.png" class="title-wind-icon" alt="">';
titleEl.innerHTML=loc?iconHtml+loc.name:iconHtml+'Wind+Waves Forecast';
document.getElementById('subtitle').textContent='';
}
function setWaveDotFromPeriod(p){
const dot=document.getElementById('now_waveDot');
if(!dot)return;
dot.style.background=wavePeriodColor(p);
}
function setDirectionArrow(arrowId,degrees){
const el=document.getElementById(arrowId);
if(!el)return;
if(degrees===null||degrees===undefined||isNaN(degrees)){
el.style.transform='rotate(0deg)';
el.style.opacity='0.3';
return;
}
el.style.transform=`rotate(${degrees+90}deg)`;
el.style.opacity='1';
}
function setNowBarLoading(){
document.getElementById('now_status').textContent=`…`;
document.getElementById('now_sun').textContent=`🌅 …/🌇 …`;
document.getElementById('now_visibility').innerHTML=`👁️ Vis:…<small>km</small>`;
document.getElementById('now_clouds').innerHTML=`☁️ Clouds:…<small>%</small>`;
document.getElementById('now_aqi').innerHTML=`<span class="aqiDot" id="now_aqiDot"></span>AQI:…<small id="now_aqi_label"></small>`;
document.getElementById('now_lightning').style.display='none';
document.getElementById('now_temp').innerHTML=`🌡️ Air:…<small>°C</small>`;
document.getElementById('now_gust').innerHTML=`<span class="gustIcon" aria-hidden="true"></span>Gust:…<small>k</small>`;
document.getElementById('now_wind').innerHTML=`Wind:…<small>k</small>`;
document.getElementById('now_dir_text').textContent='…';
setDirectionArrow('now_wind_arrow',null);
document.getElementById('now_water').innerHTML=`🌡️ Water:…<small>°C</small>`;
document.getElementById('now_wave').innerHTML=
`<span class="waveDot" id="now_waveDot" title="wave period color"></span>Wave:…<small>m</small>/…<small>s</small>`;
document.getElementById('now_wave_dir_text').textContent='…';
setDirectionArrow('now_wave_arrow',null);
document.getElementById('now_wave_score').innerHTML=`<span style="margin-right:4px;">🏄</span>Wave:…<small>/10</small>`;
document.getElementById('now_flat_score').innerHTML=`<span style="margin-right:4px;">🛟</span>Flat:…<small>/10</small>`;
setWaveDotFromPeriod(NaN);
}
function setNowBarUnavailable(){
document.getElementById('now_status').textContent=`—`;
document.getElementById('now_sun').textContent=`🌅 —/🌇 —`;
document.getElementById('now_visibility').innerHTML=`👁️ Vis:—<small>km</small>`;
document.getElementById('now_clouds').innerHTML=`☁️ Clouds:—<small>%</small>`;
document.getElementById('now_aqi').innerHTML=`<span class="aqiDot" id="now_aqiDot"></span>AQI:—<small id="now_aqi_label"></small>`;
document.getElementById('now_lightning').style.display='none';
document.getElementById('now_temp').innerHTML=`🌡️ Air:—<small>°C</small>`;
document.getElementById('now_gust').innerHTML=`<span class="gustIcon" aria-hidden="true"></span>Gust:—<small>k</small>`;
document.getElementById('now_wind').innerHTML=`Wind:—<small>k</small>`;
document.getElementById('now_dir_text').textContent='—';
setDirectionArrow('now_wind_arrow',null);
document.getElementById('now_water').innerHTML=`🌡️ Water:—<small>°C</small>`;
document.getElementById('now_wave').innerHTML=
`<span class="waveDot" id="now_waveDot" title="wave period color"></span>Wave:—<small>m</small>/—<small>s</small>`;
document.getElementById('now_wave_dir_text').textContent='—';
setDirectionArrow('now_wave_arrow',null);
document.getElementById('now_wave_score').innerHTML=`<span style="margin-right:4px;">🏄</span>Wave:—<small>/10</small>`;
document.getElementById('now_flat_score').innerHTML=`<span style="margin-right:4px;">🛟</span>Flat:—<small>/10</small>`;
setWaveDotFromPeriod(NaN);
}
function renderSelectedNowFromCache(){
const loc=PLACES[currentIndex];
if(!loc)return;
const c=currentCache[loc.key];
if(!c){
setNowBarLoading();
return;
}
document.getElementById('now_status').textContent=c.timeStr?`${c.timeStr}`:``;
document.getElementById('now_temp').innerHTML=`🌡️ Air:${c.airTemp??'—'}<small>°C</small>`;
const waterPill=document.getElementById('now_water');
if(c.waterTemp!==null&&c.waterTemp!==undefined&&c.waterTemp!=='—'){
waterPill.innerHTML=`🌡️ Water:${c.waterTemp}<small>°C</small>`;
}else{
waterPill.innerHTML=`🌡️ Water:—<small>°C</small>`;
}
const sunPill=document.getElementById('now_sun');
if(c.sunrise&&c.sunset){
sunPill.textContent=`🌅 ${c.sunrise}/🌇 ${c.sunset}`;
}else{
sunPill.textContent=`🌅 —/🌇 —`;
}
const aqiPill=document.getElementById('now_aqi');
const aqiDot=document.getElementById('now_aqiDot');
const aqiLabel=document.getElementById('now_aqi_label');
if(c.aqi!==null&&c.aqi!==undefined&&c.aqi!=='—'){
aqiPill.title=getAQIDescription(c.aqi);
aqiPill.innerHTML=`<span class="aqiDot" id="now_aqiDot" style="background:${getAQIColor(c.aqi)}"></span>AQI:${c.aqi}<small id="now_aqi_label">${getAQILabel(c.aqi)}</small>`;
}else{
aqiPill.innerHTML=`<span class="aqiDot" id="now_aqiDot"></span>AQI:—<small id="now_aqi_label"></small>`;
}
document.getElementById('now_gust').innerHTML=`<span class="gustIcon" aria-hidden="true"></span>Gust:${c.gust??'—'}<small>k</small>`;
document.getElementById('now_wind').innerHTML=`Wind:${c.wind??'—'}<small>k</small>`;
document.getElementById('now_dir_text').textContent=c.card??'—';
setDirectionArrow('now_wind_arrow',c.dir??null);
document.getElementById('now_dir').title=`Wind from ${c.card??'—'}(${c.dir??'—'}°)`;
const visibilityPill=document.getElementById('now_visibility');
if(c.visibility&&c.visibility!=='—'){
visibilityPill.innerHTML=`👁️ Vis:${c.visibility}<small>km</small>`;
}else{
visibilityPill.innerHTML=`👁️ Vis:—<small>km</small>`;
}
const cloudsPill=document.getElementById('now_clouds');
if(c.cloudCover!==null&&c.cloudCover!==undefined&&c.cloudCover!=='—'){
cloudsPill.innerHTML=`☁️ Clouds:${c.cloudCover}<small>%</small>`;
}else{
cloudsPill.innerHTML=`☁️ Clouds:—<small>%</small>`;
}
const lightningPill=document.getElementById('now_lightning');
if(c.lightning&&c.lightning>0){
lightningPill.style.display='flex';
lightningPill.innerHTML=`⚡ Lightning:${c.lightning}<small>%</small>`;
}else{
lightningPill.style.display='none';
}
document.getElementById('now_wave').innerHTML=
`<span class="waveDot" id="now_waveDot" title="wave period color"></span>Wave:${c.waveH??'—'}<small>m</small>/${c.waveP??'—'}<small>s</small>`;
setWaveDotFromPeriod(c.waveP);
const waveDirPill=document.getElementById('now_wave_dir');
if(c.waveDir!==null&&c.waveDir!==undefined&&c.waveDir!=='—'){
const waveCard=degToCardinal(c.waveDir);
document.getElementById('now_wave_dir_text').textContent=waveCard;
setDirectionArrow('now_wave_arrow',c.waveDir);
waveDirPill.title=`Waves coming from ${waveCard}(${c.waveDir}°)`;
}else{
document.getElementById('now_wave_dir_text').textContent='—';
setDirectionArrow('now_wave_arrow',null);
}
const waveScorePill=document.getElementById('now_wave_score');
const flatScorePill=document.getElementById('now_flat_score');
if(c.waveH&&c.waveP&&c.waveH!=='—'&&!isNaN(c.waveP)){
const waveHeight=parseFloat(c.waveH);
const waveScore=calculateWaveRidingScore(waveHeight,c.waveP);
const flatScore=calculateFlatWaterScore(waveHeight,c.waveP);
const waveColor=getSeaQualityColor(waveScore);
const flatColor=getSeaQualityColor(flatScore);
const waveLabel=getSeaQualityLabel(waveScore);
const flatLabel=getSeaQualityLabel(flatScore);
waveScorePill.innerHTML=`<span style="margin-right:4px;">🏄</span>Wave:<strong style="color:${waveColor}">${waveScore}</strong><small>/10 ${waveLabel}</small>`;
waveScorePill.title=`Wave Riding Score:${waveScore}/10(${waveLabel})-For surfing,wing foiling`;
flatScorePill.innerHTML=`<span style="margin-right:4px;">🛟</span>Flat:<strong style="color:${flatColor}">${flatScore}</strong><small>/10 ${flatLabel}</small>`;
flatScorePill.title=`Flat Water Score:${flatScore}/10(${flatLabel})-For SUP,kayaking,swimming`;
}else{
waveScorePill.innerHTML=`<span style="margin-right:4px;">🏄</span>Wave:—<small>/10</small>`;
flatScorePill.innerHTML=`<span style="margin-right:4px;">🛟</span>Flat:—<small>/10</small>`;
}
}
function highlightActiveButton(){
document.querySelectorAll('.btn').forEach(btn=>{
const key=btn.dataset.key;
const active=PLACES[currentIndex]?.key===key;
btn.classList.toggle('active',!!active);
});
}
function updateButtonRealtime(key){
const el=document.getElementById(`btn_rt_${key}`);
const dot=document.getElementById(`btn_wp_${key}`);
const c=currentCache[key];
if(!el)return;
if(!c){
el.textContent='…';
if(dot)dot.style.background='rgba(0,0,0,0.10)';
return;
}
el.textContent=`${c.wind??'—'}/${c.gust??'—'}${c.card??''}`.trim();
if(dot)dot.style.background=wavePeriodColor(c.waveP);
}