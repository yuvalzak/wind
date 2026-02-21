function windColor(v){
if(v<15)return '#3498db';
if(v<20)return '#f39c12';
if(v<25)return '#e67e22';
if(v<30)return '#d35400';
return '#c0392b';
}
function wavePeriodColor(p){
if(!isFinite(p))return 'rgba(0,0,0,0.10)';
if(p<5)return '#c0392b';
if(p<7)return '#e67e22';
if(p<9)return '#f39c12';
if(p<12)return '#7fb3d5';
return '#3498db';
}
function degToCardinal(deg){
const dirs=['N','NE','E','SE','S','SW','W','NW'];
const i=Math.round((((deg % 360)+360)% 360)/45)% 8;
return dirs[i];
}
function weatherCodeToEmoji(code,hour){
const isNight=hour<6||hour>=20;
if(code===0)return isNight?'🌙':'☀️';
if(code===1)return isNight?'🌙':'🌤️';
if(code===2)return isNight?'🌙':'⛅';
if(code===3)return '☁️';
if(code>=45&&code<=48)return '🌫️';
if(code>=51&&code<=57)return '🌧️';
if(code>=61&&code<=67)return '🌧️';
if(code>=71&&code<=77)return '🌨️';
if(code>=80&&code<=82)return '🌦️';
if(code>=85&&code<=86)return '🌨️';
if(code>=95&&code<=99)return '⛈️';
return isNight?'🌙':'🌤️';
}
function guessSeaForPoint(lat,lon){
if(lat>32.70&&lat<33.05&&lon>35.45&&lon<35.70)return 'lake';
if(lat>31.0&&lat<33.5&&lon>34.15&&lon<35.10)return 'med';
return 'custom';
}
function buildForecastPoint(place){
return{lat:place.lat,lon:place.lon};
}
function buildWindUrl(lat,lon){
return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`+
`&hourly=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m,weather_code,visibility,cloud_cover,lightning_potential,precipitation`+
`&current=windspeed_10m,winddirection_10m,windgusts_10m,temperature_2m,weather_code,visibility,cloud_cover,lightning_potential`+
`&daily=sunrise,sunset`+
`&windspeed_unit=kn&timezone=auto&forecast_days=7&past_days=1&models=icon_global`;
}
function buildMarineUrl(lat,lon){
return `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}`+
`&hourly=wave_height,wave_period,wave_direction,sea_surface_temperature`+
`&current=wave_height,wave_period,wave_direction,sea_surface_temperature`+
`&timezone=auto&forecast_days=7`;
}
function buildAirQualityUrl(lat,lon){
return `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}`+
`&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`+
`&timezone=auto`;
}
function getAQIColor(aqi){
if(aqi<=20)return '#50f0e6';
if(aqi<=40)return '#50ccaa';
if(aqi<=60)return '#f0e641';
if(aqi<=80)return '#ff5050';
if(aqi<=100)return '#960032';
return '#7d2181';
}
function getAQILabel(aqi){
if(aqi<=20)return 'Good';
if(aqi<=40)return 'Fair';
if(aqi<=60)return 'Moderate';
if(aqi<=80)return 'Poor';
if(aqi<=100)return 'Very Poor';
return 'Extreme';
}
function getAQIDescription(aqi){
if(aqi<=20)return 'Air quality is good. Ideal for outdoor activities.';
if(aqi<=40)return 'Air quality is fair. Acceptable for most people.';
if(aqi<=60)return 'Air quality is moderate. Sensitive individuals may experience minor issues.';
if(aqi<=80)return 'Air quality is poor. May cause breathing discomfort to some.';
if(aqi<=100)return 'Air quality is very poor. Sensitive groups should limit outdoor exposure.';
return 'Air quality is extremely poor. Everyone should avoid prolonged outdoor exposure.';
}
function idSafe(s){
return s.replace(/[^a-z0-9]/gi,'_');
}
function sizeCanvasForDPR(canvas,cssW,cssH){
const dpr=window.devicePixelRatio||1;
canvas.style.width=cssW+'px';
canvas.style.height=cssH+'px';
canvas.width=Math.max(1,Math.floor(cssW*dpr));
canvas.height=Math.max(1,Math.floor(cssH*dpr));
const ctx=canvas.getContext('2d',{alpha:true});
ctx.setTransform(dpr,0,0,dpr,0,0);
return ctx;
}
function applyCalibration(windSpeed,windDir,spotKey,waveHeight=null,gustSpeed=null){
const rules=getCalibrationRules(spotKey);
if(rules.length===0)return{value:windSpeed,calibrated:false};
let adjusted=windSpeed;
let calibrated=false;
const dir=((windDir % 360)+360)% 360;
const sector=Math.floor(dir/22.5)% 16;
for(const rule of rules){
if(!rule.sectors.includes(sector))continue;
if(rule.waveCondition&&waveHeight!==null){
const ok=rule.waveCondition.type==='less'
?waveHeight<rule.waveCondition.threshold
:waveHeight>rule.waveCondition.threshold;
if(!ok)continue;
}
if(rule.windCondition){
const ok=rule.windCondition.type==='less'
?windSpeed<rule.windCondition.threshold
:windSpeed>rule.windCondition.threshold;
if(!ok)continue;
}
if(rule.gustCondition&&gustSpeed!==null){
const ok=rule.gustCondition.type==='less'
?gustSpeed<rule.gustCondition.threshold
:gustSpeed>rule.gustCondition.threshold;
if(!ok)continue;
}
if(rule.type==='knots'){
adjusted+=rule.value;
}else{
adjusted*=(1+rule.value/100);
}
calibrated=true;
}
return{value:Math.round(adjusted),calibrated};
}
function calculateWaveRidingScore(waveHeight,wavePeriod){
if(!waveHeight||!wavePeriod||waveHeight<=0||wavePeriod<=0)return 0;
const score=(waveHeight*wavePeriod)/2.5;
return Math.min(10,Math.max(0,score)).toFixed(1);
}
function calculateFlatWaterScore(waveHeight,wavePeriod){
if(!waveHeight||waveHeight<0)waveHeight=0;
if(!wavePeriod||wavePeriod<=0)wavePeriod=8;
const heightScore=10*Math.exp(-0.542*waveHeight);
const periodBonus=(wavePeriod-8)*0.25;
return Math.min(10,Math.max(0,heightScore+periodBonus)).toFixed(1);
}
function getSeaQualityLabel(score){
score=parseFloat(score);
if(score>=9)return 'Epic';
if(score>=7)return 'Excellent';
if(score>=5)return 'Good';
if(score>=3)return 'Fair';
if(score>=1)return 'Poor';
return 'Very Poor';
}
function getSeaQualityColor(score){
score=parseFloat(score);
if(score>=9)return '#27ae60';
if(score>=7)return '#2ecc71';
if(score>=5)return '#f39c12';
if(score>=3)return '#e67e22';
return '#c0392b';
}
function applyWaveCalibration(waveHeight,spotKey,folderName){
if(!waveHeight||waveHeight<=0)return waveHeight;
const spotCal=getSpotWaveCalibration(spotKey);
if(spotCal){
return applyWaveCalRule(waveHeight,spotCal);
}
const folderCal=getFolderWaveCalibration(folderName);
if(folderCal){
const folderRule={
smallThreshold:folderCal.smallWaveThreshold,
smallOp:folderCal.smallWaveType,
smallVal:folderCal.smallWaveType==='meters'?folderCal.smallWaveValue*100:folderCal.smallWaveValue,
largeThreshold:folderCal.largeWaveThreshold,
largeOp:folderCal.largeWaveType,
largeVal:folderCal.largeWaveType==='meters'?folderCal.largeWaveValue*100:folderCal.largeWaveValue,
};
return applyWaveCalRule(waveHeight,folderRule);
}
return waveHeight;
}
function applyWaveCalRule(waveHeight,cal){
let result=waveHeight;
if(waveHeight<=cal.smallThreshold){
if(cal.smallOp==='percent'){
result=waveHeight*(1+cal.smallVal/100);
}else{
result=waveHeight+(cal.smallVal/100);
}
}else if(waveHeight>cal.largeThreshold){
if(cal.largeOp==='percent'){
result=waveHeight*(1+cal.largeVal/100);
}else{
result=waveHeight+(cal.largeVal/100);
}
}
return Math.max(0,result);
}