function updateFolderBestWindBadges(){
const groups={};
for(const p of PLACES){
const g=normalizeGroupName(p.group);
if(!groups[g])groups[g]=[];
groups[g].push(p);
}
for(const [gName,spots] of Object.entries(groups)){
const folder=document.querySelector(`.folder[data-group="${gName}"]`);
if(!folder)continue;
const header=folder.querySelector('.folder-header');
if(!header)continue;
const oldBadge=header.querySelector('.folder-best-wind-badge');
if(oldBadge)oldBadge.remove();
const bestWindSpot=getBestWindSpotForToday(spots);
if(bestWindSpot){
const badge=document.createElement('div');
badge.className='folder-best-wind-badge';
badge.innerHTML=`🔥 ${bestWindSpot.name}`;
header.appendChild(badge);
}
}
}
function updateSpotBestWindHighlight(){
const groups={};
for(const p of PLACES){
const g=normalizeGroupName(p.group);
if(!groups[g])groups[g]=[];
groups[g].push(p);
}
document.querySelectorAll('.btn.best-wind-today').forEach(btn=>{
btn.classList.remove('best-wind-today');
});
for(const [gName,spots] of Object.entries(groups)){
const bestWindSpot=getBestWindSpotForToday(spots);
if(bestWindSpot){
const btn=document.querySelector(`.btn[data-key="${bestWindSpot.key}"]`);
if(btn){
btn.classList.add('best-wind-today');
}
}
}
}
function getBestWindSpotForToday(spots){
let bestSpot=null;
let maxWind=20;
for(const spot of spots){
const cache=currentCache[spot.key];
if(cache&&typeof cache.gust==='number'&&cache.gust>maxWind){
maxWind=cache.gust;
bestSpot=spot;
}
}
return bestSpot;
}
function folderColorForName(name){
let h=0;
for(let i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))>>>0;
const hue=h % 360;
return{
bg:`hsl(${hue}85% 95%)`,
accent:`hsl(${hue}75% 45%)`
};
}
function buildFoldersUI(){
const wrap=document.getElementById('folders');
wrap.innerHTML='';
const groups={};
for(const p of PLACES){
const g=normalizeGroupName(p.group);
if(!groups[g])groups[g]=[];
groups[g].push(p);
}
let groupNames=Object.keys(groups);
try{
const savedOrder=localStorage.getItem('wind_folder_order_v1');
if(savedOrder){
const orderArray=JSON.parse(savedOrder);
const ordered=orderArray.filter(name=>groupNames.includes(name));
const remaining=groupNames.filter(name=>!ordered.includes(name));
groupNames=[...ordered,...remaining.sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()))];
}else{
groupNames.sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));
}
}catch(e){
groupNames.sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));
}
const collapsedState=getFolderCollapsed();
const spotOrders=getSpotOrder();
for(const gName of groupNames){
const folder=document.createElement('div');
folder.className='folder';
if(collapsedState[gName]){
folder.classList.add('collapsed');
}
folder.dataset.group=gName;
const header=document.createElement('div');
header.className='folder-header';
const fc=folderColorForName(gName);
header.style.setProperty('--folder-bg',fc.bg);
header.style.setProperty('--folder-accent',fc.accent);
const bestWindSpot=getBestWindSpotForToday(groups[gName]);
const bestWindBadge=bestWindSpot
?`<div class="folder-best-wind-badge">🔥 ${bestWindSpot.name}</div>`
:'';
const folderWaveCal=getFolderWaveCalibration(gName);
const waveBadge=folderWaveCal?`<div class="folder-wave-cal-badge" title="Wave calibration active">🌊⚙️</div>`:'';
header.innerHTML=`
<div class="folder-title">
<span class="folder-drag-handle" title="Drag to reorder">⠿</span>
<span class="folder-arrow">▼</span>
<span class="folder-name-display" data-group="${gName}">${gName}</span>
<span class="folder-pill">${groups[gName].length}spots</span>
${waveBadge}
</div>
${bestWindBadge}
<button type="button" class="folder-rename-btn" data-group="${gName}" title="Rename folder">✏️</button>
<button type="button" class="folder-calibrate-btn" data-group="${gName}" title="Wave calibration for ${gName}">🌊⚙️</button>
<button type="button" class="folder-delete-btn" data-group="${gName}" title="Archive folder to history">🗑️</button>
`;
header.addEventListener('click',(e)=>{
if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;
folder.classList.toggle('collapsed');
setFolderCollapsed(gName,folder.classList.contains('collapsed'));
});
const folderCalibrateBtn=header.querySelector('.folder-calibrate-btn');
if(folderCalibrateBtn){
folderCalibrateBtn.addEventListener('click',(e)=>{
e.stopPropagation();
openSettings('folders');
setTimeout(()=>{
const cards=document.querySelectorAll('#folderWaveCalibrationList>div');
for(const card of cards){
if(card.querySelector('div')?.textContent?.includes(gName)){
card.scrollIntoView({behavior:'smooth',block:'center'});
card.style.outline='3px solid #9b59b6';
setTimeout(()=>card.style.outline='',2000);
break;
}
}
},150);
});
}
const folderRenameBtn=header.querySelector('.folder-rename-btn');
if(folderRenameBtn){
folderRenameBtn.addEventListener('click',(e)=>{
e.stopPropagation();
const nameDisplay=header.querySelector('.folder-name-display');
const currentName=nameDisplay.textContent;
const input=document.createElement('input');
input.type='text';
input.value=currentName;
input.className='folder-rename-input';
input.maxLength=30;
input.style.cssText='font-size:0.95em;font-weight:700;border:2px solid #3498db;border-radius:6px;padding:2px 8px;width:140px;outline:none;';
nameDisplay.replaceWith(input);
input.focus();
input.select();
folderRenameBtn.textContent='✅';
function commitRename(){
const newName=input.value.trim();
if(newName&&newName!==currentName){
renameFolderInPlaces(currentName,newName);
}else{
buildFoldersUI();
}
}
input.addEventListener('keydown',(ev)=>{
if(ev.key==='Enter')commitRename();
if(ev.key==='Escape')buildFoldersUI();
});
input.addEventListener('blur',commitRename);
folderRenameBtn.addEventListener('click',(ev)=>{
ev.stopPropagation();
commitRename();
},{once:true});
});
}
const folderDeleteBtn=header.querySelector('.folder-delete-btn');
if(folderDeleteBtn){
folderDeleteBtn.addEventListener('click',(e)=>{
e.stopPropagation();
const count=groups[gName].length;
if(!confirm(`Archive folder "${gName}"(${count}spot${count!==1?'s':''})to history?\n\nYou can restore it anytime from Settings → History.`))return;
archiveFolderToHistory(gName);
reloadPlacesKeepSelection();
if(PLACES.length===0)currentIndex=0;
buildFoldersUI();
setHeader();
refreshSelectedPanel();
if(PLACES.length>0){loadForecastForSelected();renderSelectedNowFromCache();}
});
}
const drop=document.createElement('div');
drop.className='folder-drop';
const grid=document.createElement('div');
grid.className='spots-grid';
grid.dataset.group=gName;
let orderedSpots=groups[gName];
if(spotOrders[gName]){
const orderMap=new Map(orderedSpots.map(s=>[s.key,s]));
const ordered=[];
for(const key of spotOrders[gName]){
if(orderMap.has(key)){
ordered.push(orderMap.get(key));
orderMap.delete(key);
}
}
ordered.push(...orderMap.values());
orderedSpots=ordered;
}
orderedSpots.forEach((loc)=>{
const idx=PLACES.findIndex(p=>p.key===loc.key);
const b=document.createElement('button');
b.type='button';
b.className='btn'+(idx===currentIndex?' active':'');
if(bestWindSpot&&bestWindSpot.key===loc.key){
b.classList.add('best-wind-today');
}
b.draggable=true;
b.dataset.key=loc.key;
const hasWindCal=getCalibrationRules(loc.key).length>0;
const hasWaveCal=!!getSpotWaveCalibration(loc.key);
const calibrationIcon=(hasWindCal&&hasWaveCal)?' 🎯🌊':hasWindCal?' 🎯':hasWaveCal?' 🌊':'';
b.innerHTML=`
<div class="name">${loc.name}${calibrationIcon}</div>
<div class="sub">
<span class="wpDot" id="btn_wp_${loc.key}" title="wave period color"></span>
<span id="btn_rt_${loc.key}">…</span>
</div>
`;
b.addEventListener('click',()=>{
currentIndex=idx;
setLastSelectedKey(loc.key);
setHeader();
refreshSelectedPanel();
highlightActiveButton();
loadForecastForSelected();
renderSelectedNowFromCache();
window._scrollToTopAfterRender=true;
});
b.addEventListener('dragstart',(ev)=>{
b.classList.add('dragging');
ev.dataTransfer.setData('text/plain',loc.key);
ev.dataTransfer.setData('source-group',gName);
ev.dataTransfer.effectAllowed='move';
});
b.addEventListener('dragend',()=>b.classList.remove('dragging'));
grid.appendChild(b);
});
grid.addEventListener('dragover',(ev)=>{
ev.preventDefault();
const afterElement=getDragAfterElement(grid,ev.clientY);
const draggable=document.querySelector('.dragging');
if(!draggable)return;
if(afterElement==null){
grid.appendChild(draggable);
}else{
grid.insertBefore(draggable,afterElement);
}
});
grid.addEventListener('drop',(ev)=>{
ev.preventDefault();
const key=ev.dataTransfer.getData('text/plain');
const sourceGroup=ev.dataTransfer.getData('source-group');
const buttons=Array.from(grid.querySelectorAll('.btn'));
const newOrder=buttons.map(b=>b.dataset.key);
setSpotOrder(gName,newOrder);
if(sourceGroup&&sourceGroup!==gName){
movePlaceToGroup(key,gName);
}
});
drop.appendChild(grid);
folder.addEventListener('dragover',(ev)=>{
ev.preventDefault();
folder.classList.add('dragover');
ev.dataTransfer.dropEffect='move';
});
folder.addEventListener('dragleave',()=>folder.classList.remove('dragover'));
folder.addEventListener('drop',(ev)=>{
ev.preventDefault();
folder.classList.remove('dragover');
const key=ev.dataTransfer.getData('text/plain');
if(!key)return;
movePlaceToGroup(key,gName);
});
folder.appendChild(header);
folder.appendChild(drop);
wrap.appendChild(folder);
}
PLACES.forEach(loc=>updateButtonRealtime(loc.key));
highlightActiveButton();
setupFolderDrag(wrap);
}
function getDragAfterElement(container,y){
const draggableElements=[...container.querySelectorAll('.btn:not(.dragging)')];
return draggableElements.reduce((closest,child)=>{
const box=child.getBoundingClientRect();
const offset=y-box.top-box.height/2;
if(offset<0&&offset>closest.offset){
return{offset:offset,element:child};
}else{
return closest;
}
},{offset:Number.NEGATIVE_INFINITY}).element;
}
function editFolderName(oldName){
const newName=prompt(`Rename folder "${oldName}" to:`,oldName);
if(!newName||!newName.trim()||newName===oldName)return;
const normalized=normalizeGroupName(newName);
const groups=getAllGroups();
if(groups.includes(normalized)&&normalized!==oldName){
return;
}
const places=getPlaces();
let changed=false;
for(const p of places){
if(normalizeGroupName(p.group)===oldName){
p.group=normalized;
changed=true;
}
}
if(changed){
savePlaces(places);
reloadPlacesKeepSelection();
buildFoldersUI();
refreshSelectedPanel();
}
}
function movePlaceToGroup(key,groupName){
const places=getPlaces();
const idx=places.findIndex(p=>p.key===key);
if(idx<0)return;
places[idx].group=normalizeGroupName(groupName);
savePlaces(places);
const lastKey=key;
reloadPlacesKeepSelection();
currentIndex=Math.max(0,PLACES.findIndex(p=>p.key===lastKey));
if(currentIndex<0)currentIndex=0;
if(PLACES[currentIndex])setLastSelectedKey(PLACES[currentIndex].key);
buildFoldersUI();
setHeader();
refreshSelectedPanel();
}
function setupFolderDrag(wrap){
let dragSrc=null;
wrap.querySelectorAll('.folder').forEach(folder=>{
const handle=folder.querySelector('.folder-drag-handle');
if(!handle)return;
handle.addEventListener('mousedown',startDrag);
handle.addEventListener('touchstart',startDrag,{passive:true});
function startDrag(e){
dragSrc=folder;
folder.classList.add('folder-dragging');
}
});
wrap.addEventListener('dragover',(e)=>e.preventDefault());
wrap.addEventListener('pointermove',(e)=>{
if(!dragSrc)return;
const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.folder');
if(target&&target!==dragSrc){
const rect=target.getBoundingClientRect();
const midY=rect.top+rect.height/2;
if(e.clientY<midY){
wrap.insertBefore(dragSrc,target);
}else{
wrap.insertBefore(dragSrc,target.nextSibling);
}
}
});
wrap.addEventListener('pointerup',()=>{
if(!dragSrc)return;
dragSrc.classList.remove('folder-dragging');
dragSrc=null;
saveFolderOrder(wrap);
});
wrap.addEventListener('pointercancel',()=>{
if(dragSrc)dragSrc.classList.remove('folder-dragging');
dragSrc=null;
});
}
function saveFolderOrder(wrap){
const order=[...wrap.querySelectorAll('.folder')].map(f=>f.dataset.group);
try{localStorage.setItem('wind_folder_order_v1',JSON.stringify(order));}catch(e){}
}