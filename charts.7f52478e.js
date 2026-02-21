function buildYAxisTicks(id,yMax){
const ticksEl=document.getElementById(`ticks_${id}`);
const step=5;
const values=[];
for(let v=yMax;v>=0;v-=step)values.push(v);
ticksEl.innerHTML=values.map(v=>`<div>${v}</div>`).join('');
}
function dayBlock(dayLabel,data,locName){
const id=idSafe(locName+'_'+dayLabel);
window.days[id]={dayLabel,data,locName};
const hasCalibration=data.some(h=>h.wasCalibrated);
return `
<div class="day-separator" data-day-id="${id}">${locName}&bull;${dayLabel}${hasCalibration?'<span title="Calibration rules active today" style="font-size:0.85em;opacity:0.85;">🎯</span>':''}</div>
<div class="day-banner" id="banner_${id}">
<span class="banner-time" id="btime_${id}"></span>
<span class="banner-wind" id="bwind_${id}"></span>
<span class="banner-gust" id="bgust_${id}"></span>
<span class="banner-wave" id="bwave_${id}"></span>
<span class="banner-scores" id="bscores_${id}"></span>
</div>
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
function createWindStreakAnimator(bgCanvas,cssW,cssH,dayData){
const ctx=sizeCanvasForDPR(bgCanvas,cssW,cssH);
const count=Math.max(90,Math.floor(cssW*cssH/9000));
const streaks=[];
for(let i=0;i<count;i++){
streaks.push({x:Math.random()*cssW,y:Math.random()*cssH,seed:Math.random()*9999});
}
let rafId=0;
let running=false;
function sampleAtX(px){
const idx=Math.max(0,Math.min(dayData.length-1,Math.round(px/ITEM_W)));
return dayData[idx];
}
function draw(){
if(!running)return;
ctx.fillStyle='rgba(255,255,255,0.14)';
ctx.fillRect(0,0,cssW,cssH);
for(const s of streaks){
const smp=sampleAtX(s.x)||{dir:0,speed:0,gust:0};
const wind=Number(smp.speed)||0;
const gust=Number(smp.gust)||wind;
const diff=Math.max(0,Math.min(25,gust-wind));
const len=8+(diff/25)*32;
const v=0.4+Math.min(35,wind)*(2.6/35);
const normalizedDir=((Number(smp.dir)% 360)+360)% 360;
const ang=normalizedDir*Math.PI/180;
const vx=Math.sin(ang)*v;
const vy=-Math.cos(ang)*v;
s.x+=vx;
s.y+=vy;
if(s.x<-30)s.x=cssW+30+(Math.random()*20-10);
if(s.x>cssW+30)s.x=-30+(Math.random()*20-10);
if(s.y<-30)s.y=cssH+30+(Math.random()*20-10);
if(s.y>cssH+30)s.y=-30+(Math.random()*20-10);
const c=windColor(gust);
const wobble=(Math.sin(s.seed+(s.x+s.y)*0.01)*0.06);
const a2=ang+wobble;
ctx.save();
ctx.globalAlpha=0.20;
ctx.lineWidth=1;
ctx.strokeStyle=c;
ctx.beginPath();
ctx.moveTo(s.x,s.y);
ctx.lineTo(s.x+Math.sin(a2)*len,s.y-Math.cos(a2)*len);
ctx.stroke();
ctx.restore();
}
rafId=requestAnimationFrame(draw);
}
function start(){
if(running)return;
running=true;
ctx.clearRect(0,0,cssW,cssH);
ctx.fillStyle='rgba(255,255,255,1)';
ctx.fillRect(0,0,cssW,cssH);
rafId=requestAnimationFrame(draw);
}
function stop(){
running=false;
if(rafId)cancelAnimationFrame(rafId);
}
return{start,stop};
}
function drawDay(dayObj){
const{dayLabel,data,locName}=dayObj;
const id=idSafe(locName+'_'+dayLabel);
const inner=document.getElementById(`inner_${id}`);
const dRow=document.getElementById(`d_${id}`);
const wRow=document.getElementById(`w_${id}`);
const tRow=document.getElementById(`t_${id}`);
const scrollContainer=inner.parentElement;
const availableWidth=scrollContainer.clientWidth-20;
const calculatedItemW=Math.max(ITEM_W,Math.floor(availableWidth/data.length));
const totalW=calculatedItemW*data.length;
inner.style.width=totalW+'px';
for(let i=0;i<data.length;i++){
const o=data[i];
const normalizedWindDir=((o.dir % 360)+360)% 360;
const card=degToCardinal(normalizedWindDir);
let waveArrow='';
if(typeof o.waveDir==='number'){
const normalizedWaveDir=((o.waveDir % 360)+360)% 360;
waveArrow=`<div class="wave-arrow" style="transform:rotate(${normalizedWaveDir}deg);color:#16a085;font-size:0.9em;margin-top:2px">↓</div>`;
}
dRow.insertAdjacentHTML('beforeend',`
<div class="direction-item" style="width:${calculatedItemW}px">
<div class="arrow" style="transform:rotate(${normalizedWindDir}deg)">↓</div>
<div class="cardinal">${card}</div>
${waveArrow}
</div>
`);
if(i % 4===0){
const hour=o.time.getHours();
const emoji=(typeof o.weather==='number')?weatherCodeToEmoji(o.weather,hour):'';
const temp=(typeof o.temp==='number')?`${Math.round(o.temp)}°`:'';
wRow.insertAdjacentHTML('beforeend',`
<div class="weather-item" style="width:${calculatedItemW*4}px">
<div class="weather-icon">${emoji}</div>
<div class="temp-label">${temp}</div>
</div>
`);
}
tRow.insertAdjacentHTML('beforeend',`
<div class="time-item" style="width:${calculatedItemW}px">
<div class="time-label">${o.time.getHours()}</div>
</div>
`);
}
const maxV=Math.max(...data.map(o=>Math.max(o.speed,o.gust)));
const yMax=Math.max(35,Math.ceil(maxV/5)*5);
const bg=document.getElementById(`bg_${id}`);
const c=document.getElementById(`c_${id}`);
bg.style.display='none';
c.style.width=totalW+'px';
c.style.height=CANVAS_H+'px';
c.width=totalW;
c.height=CANVAS_H;
const bandAnnotations={
band0:{type:'box',yScaleID:'y',yMin:0,yMax:15,backgroundColor:'rgba(232,244,248,0.26)',borderWidth:0},
band1:{type:'box',yScaleID:'y',yMin:15,yMax:20,backgroundColor:'rgba(243,156,18,0.10)',borderWidth:0},
band2:{type:'box',yScaleID:'y',yMin:20,yMax:25,backgroundColor:'rgba(230,126,34,0.11)',borderWidth:0},
band3:{type:'box',yScaleID:'y',yMin:25,yMax:30,backgroundColor:'rgba(211,84,0,0.12)',borderWidth:0},
band4:{type:'box',yScaleID:'y',yMin:30,yMax:yMax,backgroundColor:'rgba(192,57,43,0.12)',borderWidth:0}
};
const labels=data.map(o=>o.time);
const windArr=data.map(o=>o.speed);
const gustArr=data.map(o=>o.gust);
const actualWindArr=data.map(o=>(typeof o.actualWind==='number')?o.actualWind:null);
const actualGustArr=data.map(o=>(typeof o.actualWind==='number')?o.gust:null);
const waveHArr=data.map(o=>(typeof o.waveH==='number'?o.waveH*10:null));
const wavePArr=data.map(o=>(typeof o.waveP==='number'?o.waveP:NaN));
const waveDirArr=data.map(o=>(typeof o.waveDir==='number'?o.waveDir:null));
const waveBarColors=data.map(o=>wavePeriodColor(o.waveP));
charts.push(new Chart(c,{
data:{
labels,
datasets:[
{
type:'bar',
label:'Wave',
data:waveHArr,
yAxisID:'y',
backgroundColor:waveBarColors,
borderColor:'rgba(0,0,0,0.12)',
borderWidth:1,
barThickness:8,
maxBarThickness:10
},
{
type:'line',
label:'Actual Gusts Area',
data:actualGustArr,
yAxisID:'y',
borderColor:'rgba(39,174,96,0)',
backgroundColor:'rgba(39,174,96,0.15)',
borderWidth:0,
fill:true,
tension:0.32,
pointRadius:0,
spanGaps:false
},
{
type:'line',
label:'Actual Wind',
data:actualWindArr,
yAxisID:'y',
borderColor:'#27ae60',
backgroundColor:'#27ae60',
borderWidth:3,
tension:0.32,
pointRadius:4,
pointStyle:'circle',
borderDash:[0,0],
spanGaps:false
},
{
type:'line',
label:'Wind',
data:windArr,
yAxisID:'y',
borderWidth:2.5,
tension:0.32,
pointRadius:3,
segment:{borderColor:ctx=>windColor(ctx.p0.parsed.y)},
pointBackgroundColor:ctx=>windColor(ctx.parsed.y)
},
{
type:'line',
label:'Gusts',
data:gustArr,
yAxisID:'y',
borderDash:[5,4],
borderWidth:2.5,
tension:0.32,
pointRadius:3,
borderColor:'#e53935',
backgroundColor:'#e53935',
segment:{borderColor:()=>'#e53935'},
pointBackgroundColor:()=>'#e53935'
}
]
},
options:{
responsive:false,
interaction:{mode:'index',intersect:false},
plugins:{
legend:{
position:'top',
labels:{
filter:(legendItem)=>legendItem.text!=='Actual Gusts Area'
}
},
annotation:{annotations:bandAnnotations},
tooltip:{
enabled:false,
external:(context)=>{
const dataPoints=context.tooltip?.dataPoints;
const sepEl=document.querySelector(`.day-separator[data-day-id="${id}"]`);
if(!dataPoints||dataPoints.length===0){
if(sepEl)sepEl.nextElementSibling?.classList.remove('has-data');
return;
}
const idx=dataPoints[0].dataIndex;
const d=data[idx];
if(!d)return;
const el=(s)=>document.getElementById(s+'_'+id);
const timeEl=el('btime');
const windEl=el('bwind');
const gustEl=el('bgust');
const waveEl=el('bwave');
const scoreEl=el('bscores');
if(!timeEl)return;
if(sepEl)sepEl.nextElementSibling.classList.add('has-data');
const hr=d.time.getHours();
const ampm=hr>=12?'pm':'am';
const hr12=hr % 12||12;
timeEl.textContent=`${hr12}${ampm}`;
const measured=(typeof d.actualWind==='number');
const windDirTxt=(typeof d.dir==='number')?` ${degToCardinal(d.dir)}`:'';
windEl.textContent=`💨 ${d.speed}k${windDirTxt}`;
windEl.style.color=measured?'#6dffaa':'';
gustEl.textContent=`↑${d.gust}k gust`;
if(typeof d.waveH==='number'){
const pTxt=(typeof d.waveP==='number')?` ${d.waveP.toFixed(1)}s`:'';
waveEl.textContent=`🌊 ${d.waveH.toFixed(1)}m${pTxt}`;
}else{
waveEl.textContent='';
}
if(typeof d.waveH==='number'&&typeof d.waveP==='number'){
const ws=calculateWaveRidingScore(d.waveH,d.waveP);
const fs=calculateFlatWaterScore(d.waveH,d.waveP);
scoreEl.textContent=`🏄${ws}/10 🛟${fs}/10`;
}else{
scoreEl.textContent='';
}
}
}
},
animation:{
onComplete(){
const ca=this.chartArea;
if(!ca)return;
const ticksEl=document.getElementById('ticks_'+id);
const canvasEl=this.canvas;
if(!ticksEl||!canvasEl)return;
const canvasRect=canvasEl.getBoundingClientRect();
const ticksRect=ticksEl.getBoundingClientRect();
const scaleY=canvasRect.height/this.height;
const dataTop=canvasRect.top+ca.top*scaleY-ticksRect.top;
const dataBottom=canvasRect.top+ca.bottom*scaleY-ticksRect.top;
const dataH=dataBottom-dataTop;
const step=5;
const values=[];
for(let v=yMax;v>=0;v-=step)values.push(v);
ticksEl.innerHTML=values.map(v=>{
const py=dataTop+(1-v/yMax)*dataH;
return `<div style="position:absolute;right:3px;top:${Math.round(py)}px;transform:translateY(-50%);font-size:11px;font-weight:900;color:#555;line-height:1;">${v}</div>`;
}).join('');
}
},
layout:{padding:0},
scales:{
y:{
beginAtZero:true,
min:0,
max:yMax,
display:false,
grace:0,
},
x:{display:false}
}
}
}));
}
function renderForecast(windData,marineData,loc){
const h=windData.hourly;
const now=new Date();
const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate());
const marineMap=new Map();
if(marineData?.hourly?.time){
const mt=marineData.hourly.time;
const mh=marineData.hourly.wave_height||[];
const mp=marineData.hourly.wave_period||[];
const md=marineData.hourly.wave_direction||[];
for(let i=0;i<mt.length;i++){
marineMap.set(mt[i],{
waveH:(typeof mh[i]==='number')?mh[i]:null,
waveP:(typeof mp[i]==='number')?mp[i]:null,
waveDir:(typeof md[i]==='number')?md[i]:null
});
}
}
let html='';
let curDay='';
let day=[];
window.days={};
for(let i=0;i<h.time.length;i++){
const tStr=h.time[i];
const t=new Date(tStr);
if(t<todayStart)continue;
const dLabel=t.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
if(dLabel!==curDay){
if(day.length)html+=dayBlock(curDay,day,loc.name);
curDay=dLabel;
day=[];
}
const dir=Number(h.winddirection_10m[i]);
const rawSpeed=Number(h.windspeed_10m[i]);
const rawGust=Number(h.windgusts_10m[i]);
const m=marineMap.get(tStr)||{waveH:null,waveP:null};
const rawWaveH=(typeof m.waveH==='number')?m.waveH:null;
const folderName=loc.group?normalizeGroupName(loc.group):null;
const calibratedWaveH=rawWaveH!==null?applyWaveCalibration(rawWaveH,loc.key,folderName):null;
const rawSpeedRnd=Math.round(rawSpeed);
const rawGustRnd=Math.round(rawGust);
const speedResult=applyCalibration(rawSpeedRnd,dir,loc.key,calibratedWaveH,rawGustRnd);
const gustResult=applyCalibration(rawGustRnd,dir,loc.key,calibratedWaveH,rawGustRnd);
const speed=speedResult.value;
const gust=gustResult.value;
const wasCalibrated=speedResult.calibrated||gustResult.calibrated;
const temp=(typeof h.temperature_2m[i]==='number')?h.temperature_2m[i]:null;
const weather=(typeof h.weather_code[i]==='number')?h.weather_code[i]:null;
const isActual=t<now;
const actualWind=isActual?speed:null;
day.push({
time:t,
speed,
gust,
dir,
waveH:calibratedWaveH,
waveP:(typeof m.waveP==='number')?m.waveP:null,
waveDir:(typeof m.waveDir==='number')?m.waveDir:null,
temp,
weather,
actualWind,
wasCalibrated
});
}
if(day.length)html+=dayBlock(curDay,day,loc.name);
document.getElementById('content').innerHTML=html;
Object.values(window.days).forEach(drawDay);
wireScrollSync();
scrollAllToNineAM();
applyGoodDayHighlights();
applyGoodDaySpotBadges();
if(window._scrollToTopAfterRender){
window._scrollToTopAfterRender=false;
setTimeout(()=>{
window.scrollTo({top:0,behavior:'smooth'});
document.documentElement.scrollTop=0;
document.body.scrollTop=0;
},50);
}
}
function wireScrollSync(){
const scrollers=Array.from(document.querySelectorAll('.day-scroll'));
scrollers.forEach(sc=>{
sc.addEventListener('scroll',()=>{
if(syncingScroll)return;
syncingScroll=true;
const x=sc.scrollLeft;
for(const other of scrollers){
if(other!==sc)other.scrollLeft=x;
}
syncingScroll=false;
},{passive:true});
});
}
function scrollAllToNineAM(){
const scrollers=Array.from(document.querySelectorAll('.day-scroll'));
if(scrollers.length===0)return;
const firstScroller=scrollers[0];
const firstItem=firstScroller.querySelector('.direction-item');
if(!firstItem)return;
const itemWidth=firstItem.offsetWidth;
const isMobile=window.innerWidth<768;
const dayEntries=Object.values(window.days||{});
const now=new Date();
const currentHour=now.getHours();
let targetX=0;
let found=false;
for(const day of dayEntries){
if(isMobile){
const idx=day.data.findIndex(o=>{
const dataTime=o.time;
return dataTime.getDate()===now.getDate()&&
dataTime.getMonth()===now.getMonth()&&
dataTime.getHours()===currentHour;
});
if(idx>=0){
const scrollerWidth=firstScroller.clientWidth;
targetX=Math.max(0,(idx*itemWidth)-(scrollerWidth/2)+(itemWidth/2));
found=true;
break;
}
}else{
const idx=day.data.findIndex(o=>{
const dataTime=o.time;
return dataTime.getDate()===now.getDate()&&
dataTime.getMonth()===now.getMonth();
});
if(idx>=0){
targetX=Math.max(0,idx*itemWidth);
found=true;
break;
}
}
}
if(!found){
for(const day of dayEntries){
const idx=day.data.findIndex(o=>o.time.getHours()===9);
if(idx>=0){
const scrollerWidth=firstScroller.clientWidth;
targetX=Math.max(0,(idx*itemWidth)-(scrollerWidth/2)+(itemWidth/2));
break;
}
}
}
syncingScroll=true;
for(const sc of scrollers)sc.scrollLeft=targetX;
syncingScroll=false;
}
function applyGoodDayHighlights(){
const prefs=getMyDayPrefs();
document.querySelectorAll('.day-separator.good-day').forEach(el=>el.classList.remove('good-day'));
if(!prefs)return;
for(const dayObj of Object.values(window.days||{})){
if(isDayGood(prefs,dayObj.data)){
const id=idSafe(dayObj.locName+'_'+dayObj.dayLabel);
const el=document.querySelector(`.day-separator[data-day-id="${id}"]`);
if(el)el.classList.add('good-day');
}
}
}
function applyGoodDaySpotBadges(){
const prefs=getMyDayPrefs();
document.querySelectorAll('.btn.good-day-spot').forEach(el=>el.classList.remove('good-day-spot'));
if(!prefs)return;
const bySpot={};
for(const dayObj of Object.values(window.days||{})){
if(!bySpot[dayObj.locName])bySpot[dayObj.locName]=[];
bySpot[dayObj.locName].push(dayObj);
}
for(const [locName,days] of Object.entries(bySpot)){
const hasGoodDay=days.some(d=>isDayGood(prefs,d.data));
if(hasGoodDay){
const loc=PLACES.find(p=>p.name===locName);
if(loc){
const btn=document.querySelector(`.btn[data-key="${loc.key}"]`);
if(btn)btn.classList.add('good-day-spot');
}
}
}
}