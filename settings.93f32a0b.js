const settingsBackdrop=document.getElementById('settingsBackdrop');
const settingsBtn=document.getElementById('settingsBtn');
const closeSettingsBtn=document.getElementById('closeSettingsBtn');
const settingsTabs=document.querySelectorAll('.settings-tab');
const settingsContents=document.querySelectorAll('.settings-content');
function openSettings(tabName='help'){
settingsBackdrop.style.display='flex';
settingsBackdrop.setAttribute('aria-hidden','false');
switchSettingsTab(tabName);
if(tabName==='folders'){
populateFolderRenameList();
populateFolderWaveCalibrationList();
}
if(tabName==='history'){
populateFolderHistoryList();
}
if(tabName==='bestspots'){
renderBestSpotsList();
}
}
function closeSettings(){
settingsBackdrop.style.display='none';
settingsBackdrop.setAttribute('aria-hidden','true');
}
function switchSettingsTab(tabName){
settingsTabs.forEach(tab=>{
if(tab.dataset.tab===tabName){
tab.classList.add('active');
}else{
tab.classList.remove('active');
}
});
settingsContents.forEach(content=>{
if(content.id===`settings-${tabName}`){
content.classList.add('active');
content.style.display='block';
}else{
content.classList.remove('active');
content.style.display='none';
}
});
}
function populateFolderRenameList(){
const folderRenameList=document.getElementById('folderRenameList');
const groups=getAllGroups();
folderRenameList.innerHTML='';
if(groups.length===0||(groups.length===1&&groups[0]==='Ungrouped')){
folderRenameList.innerHTML='<p style="color:#6c7a89;">No folders to rename. Create folders by adding spots with the "Pick on map" button.</p>';
return;
}
for(const group of groups){
if(group==='Ungrouped')continue;
const folderDiv=document.createElement('div');
folderDiv.className='folder-rename-item';
folderDiv.draggable=true;
folderDiv.dataset.folder=group;
folderDiv.style.cssText='display:flex;gap:10px;align-items:center;padding:12px;background:#f8f9fa;border-radius:8px;cursor:move;flex-wrap:wrap;';
const dragHandle=document.createElement('span');
dragHandle.textContent='⋮⋮';
dragHandle.style.cssText='color:#95a5a6;font-size:1.2em;cursor:move;user-select:none;';
const currentName=document.createElement('span');
currentName.style.cssText='font-weight:700;color:#2c3e50;min-width:100px;flex:0 1 auto;';
currentName.textContent=group;
const input=document.createElement('input');
input.type='text';
input.className='input';
input.placeholder='New folder name';
input.value=group;
input.style.cssText='flex:1 1 150px;min-width:120px;';
const renameBtn=document.createElement('button');
renameBtn.type='button';
renameBtn.className='save';
renameBtn.textContent='Rename';
renameBtn.style.cssText='padding:10px 20px;flex:0 0 auto;';
renameBtn.onclick=()=>renameFolder(group,input.value.trim());
folderDiv.appendChild(dragHandle);
folderDiv.appendChild(currentName);
folderDiv.appendChild(input);
folderDiv.appendChild(renameBtn);
folderRenameList.appendChild(folderDiv);
folderDiv.addEventListener('dragstart',handleDragStart);
folderDiv.addEventListener('dragover',handleDragOver);
folderDiv.addEventListener('drop',handleDrop);
folderDiv.addEventListener('dragend',handleDragEnd);
}
}
let draggedElement=null;
function handleDragStart(e){
draggedElement=this;
this.style.opacity='0.4';
e.dataTransfer.effectAllowed='move';
}
function handleDragOver(e){
if(e.preventDefault){
e.preventDefault();
}
e.dataTransfer.dropEffect='move';
if(this===draggedElement)return;
const items=Array.from(document.querySelectorAll('.folder-rename-item'));
const draggedIndex=items.indexOf(draggedElement);
const targetIndex=items.indexOf(this);
if(draggedIndex<targetIndex){
this.parentNode.insertBefore(draggedElement,this.nextSibling);
}else{
this.parentNode.insertBefore(draggedElement,this);
}
return false;
}
function handleDrop(e){
if(e.stopPropagation){
e.stopPropagation();
}
return false;
}
function handleDragEnd(e){
this.style.opacity='1';
const items=Array.from(document.querySelectorAll('.folder-rename-item'));
const newOrder=items.map(item=>item.dataset.folder);
try{
localStorage.setItem('wind_folder_order_v1',JSON.stringify(newOrder));
}catch(e){
console.error('Failed to save folder order',e);
}
buildFoldersUI();
}
function renameFolder(oldName,newName){
if(!newName||newName===oldName){
return;
}
const normalized=normalizeGroupName(newName);
if(normalized==='Ungrouped'){
return;
}
const groups=getAllGroups();
if(groups.includes(normalized)&&normalized!==oldName){
return;
}
const places=getPlaces();
let updatedCount=0;
for(const place of places){
if(normalizeGroupName(place.group)===oldName){
place.group=normalized;
updatedCount++;
}
}
if(updatedCount>0){
savePlaces(places);
const waveCal=getFolderWaveCalibration(oldName);
if(waveCal){
setFolderWaveCalibration(normalized,waveCal);
setFolderWaveCalibration(oldName,null);
}
reloadPlacesKeepSelection();
buildFoldersUI();
populateFolderRenameList();
populateFolderWaveCalibrationList();
}
}
function populateFolderWaveCalibrationList(){
const container=document.getElementById('folderWaveCalibrationList');
const groups=getAllGroups().filter(g=>g!=='Ungrouped');
container.innerHTML='';
if(groups.length===0){
container.innerHTML='<p style="color:#6c7a89;">No folders available. Create folders by adding spots.</p>';
return;
}
for(const group of groups){
const calibration=getFolderWaveCalibration(group);
const spotsInFolder=getPlaces().filter(p=>normalizeGroupName(p.group)===group).length;
const card=document.createElement('div');
card.style.cssText=`padding:16px;background:#f8f9fa;border-radius:12px;border:2px solid ${calibration?'#16a085':'#ecf0f1'};`;
const header=document.createElement('div');
header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;';
const title=document.createElement('div');
title.style.cssText='font-weight:700;color:#2c3e50;font-size:1.1em;';
title.textContent=`📁 ${group}`;
const rightSide=document.createElement('div');
rightSide.style.cssText='display:flex;align-items:center;gap:8px;';
const spotCount=document.createElement('div');
spotCount.style.cssText='color:#6c7a89;font-size:0.9em;';
spotCount.textContent=`${spotsInFolder}spot${spotsInFolder!==1?'s':''}`;
rightSide.appendChild(spotCount);
if(calibration){
const activeBadge=document.createElement('div');
activeBadge.style.cssText='background:#16a085;color:white;padding:3px 8px;border-radius:8px;font-size:0.78em;font-weight:700;';
const smallDesc=calibration.smallWaveType==='percent'
?`${calibration.smallWaveValue>0?'+':''}${calibration.smallWaveValue}%`
:`${calibration.smallWaveValue>0?'+':''}${calibration.smallWaveValue}m`;
const largeDesc=calibration.largeWaveType==='percent'
?`${calibration.largeWaveValue>0?'+':''}${calibration.largeWaveValue}%`
:`${calibration.largeWaveValue>0?'+':''}${calibration.largeWaveValue}m`;
activeBadge.textContent=`≤${calibration.smallWaveThreshold}m:${smallDesc}/>${calibration.largeWaveThreshold}m:${largeDesc}`;
activeBadge.title='Active wave calibration';
rightSide.appendChild(activeBadge);
}
header.appendChild(title);
header.appendChild(rightSide);
card.appendChild(header);
const smallSection=document.createElement('div');
smallSection.style.cssText='margin-bottom:12px;padding:12px;background:#fff;border-radius:8px;';
smallSection.innerHTML=`
<div style="font-weight:700;color:#3498db;margin-bottom:8px;">Small Waves(≤ threshold)</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
<label style="color:#6c7a89;">Threshold:</label>
<input type="number" class="input" id="small_threshold_${idSafe(group)}" value="${calibration?.smallWaveThreshold||1}" step="0.1" min="0" max="5" style="width:80px;"/><small>m</small>
<label style="color:#6c7a89;margin-left:10px;">Adjustment:</label>
<select class="select" id="small_type_${idSafe(group)}" style="width:100px;">
<option value="percent" ${calibration?.smallWaveType==='percent'?'selected':''}>Percent</option>
<option value="meters" ${calibration?.smallWaveType==='meters'?'selected':''}>Meters</option>
</select>
<input type="number" class="input" id="small_value_${idSafe(group)}" value="${calibration?.smallWaveValue||-50}" step="0.1" style="width:80px;"/>
<small id="small_unit_${idSafe(group)}">${calibration?.smallWaveType==='meters'?'m':'%'}</small>
</div>
<div style="margin-top:6px;color:#6c7a89;font-size:0.85em;">Example:-50% on 0.8m wave=0.4m</div>
`;
card.appendChild(smallSection);
const largeSection=document.createElement('div');
largeSection.style.cssText='margin-bottom:12px;padding:12px;background:#fff;border-radius:8px;';
largeSection.innerHTML=`
<div style="font-weight:700;color:#e67e22;margin-bottom:8px;">Large Waves(>threshold)</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
<label style="color:#6c7a89;">Threshold:</label>
<input type="number" class="input" id="large_threshold_${idSafe(group)}" value="${calibration?.largeWaveThreshold||1}" step="0.1" min="0" max="5" style="width:80px;"/><small>m</small>
<label style="color:#6c7a89;margin-left:10px;">Adjustment:</label>
<select class="select" id="large_type_${idSafe(group)}" style="width:100px;">
<option value="percent" ${calibration?.largeWaveType==='percent'?'selected':''}>Percent</option>
<option value="meters" ${calibration?.largeWaveType==='meters'?'selected':''}>Meters</option>
</select>
<input type="number" class="input" id="large_value_${idSafe(group)}" value="${calibration?.largeWaveValue||-0.5}" step="0.1" style="width:80px;"/>
<small id="large_unit_${idSafe(group)}">${calibration?.largeWaveType==='meters'?'m':'%'}</small>
</div>
<div style="margin-top:6px;color:#6c7a89;font-size:0.85em;">Example:-0.5m on 2m wave=1.5m</div>
`;
card.appendChild(largeSection);
const smallTypeSelect=smallSection.querySelector(`#small_type_${idSafe(group)}`);
const largeTypeSelect=largeSection.querySelector(`#large_type_${idSafe(group)}`);
smallTypeSelect.addEventListener('change',()=>{
document.getElementById(`small_unit_${idSafe(group)}`).textContent=smallTypeSelect.value==='meters'?'m':'%';
});
largeTypeSelect.addEventListener('change',()=>{
document.getElementById(`large_unit_${idSafe(group)}`).textContent=largeTypeSelect.value==='meters'?'m':'%';
});
const buttonRow=document.createElement('div');
buttonRow.style.cssText='display:flex;gap:8px;margin-top:12px;';
const saveBtn=document.createElement('button');
saveBtn.type='button';
saveBtn.className='save';
saveBtn.textContent='Save Calibration';
saveBtn.onclick=()=>saveFolderWaveCalibration(group);
const clearBtn=document.createElement('button');
clearBtn.type='button';
clearBtn.className='actionbtn danger';
clearBtn.textContent='Clear';
clearBtn.style.cssText='background:#e74c3c;color:white;';
clearBtn.onclick=()=>{
setFolderWaveCalibration(group,null);
populateFolderWaveCalibrationList();
refreshRealtimeForAllButtons();
buildFoldersUI();
};
buttonRow.appendChild(saveBtn);
if(calibration)buttonRow.appendChild(clearBtn);
card.appendChild(buttonRow);
container.appendChild(card);
}
}
function saveFolderWaveCalibration(folderName){
const safeName=idSafe(folderName);
const calibration={
smallWaveThreshold:parseFloat(document.getElementById(`small_threshold_${safeName}`).value)||1,
smallWaveType:document.getElementById(`small_type_${safeName}`).value,
smallWaveValue:parseFloat(document.getElementById(`small_value_${safeName}`).value)||0,
largeWaveThreshold:parseFloat(document.getElementById(`large_threshold_${safeName}`).value)||1,
largeWaveType:document.getElementById(`large_type_${safeName}`).value,
largeWaveValue:parseFloat(document.getElementById(`large_value_${safeName}`).value)||0
};
setFolderWaveCalibration(folderName,calibration);
populateFolderWaveCalibrationList();
refreshRealtimeForAllButtons();
buildFoldersUI();
}
settingsBtn.addEventListener('click',()=>openSettings('help'));
closeSettingsBtn.addEventListener('click',closeSettings);
settingsBackdrop.addEventListener('click',(e)=>{
if(e.target===settingsBackdrop)closeSettings();
});
settingsTabs.forEach(tab=>{
tab.addEventListener('click',()=>{
const tabName=tab.dataset.tab;
switchSettingsTab(tabName);
if(tabName==='folders'){
populateFolderRenameList();
populateFolderWaveCalibrationList();
}else if(tabName==='bestspots'){
renderBestSpotsList();
}else if(tabName==='history'){
populateFolderHistoryList();
}else if(tabName==='myday'){
loadMyDayForm();
}
});
});
function populateFolderHistoryList(){
const container=document.getElementById('folderHistoryList');
if(!container)return;
const history=getFolderHistory();
if(history.length===0){
container.innerHTML='<p style="color:#6c7a89;font-style:italic;">No archived folders yet. Use the 🗑️ button on a folder to archive it here.</p>';
return;
}
container.innerHTML='';
for(const entry of history){
const card=document.createElement('div');
card.style.cssText='background:#f8f9fa;border-radius:12px;border:2px solid #dee2e6;padding:16px;';
const dateStr=new Date(entry.archivedAt).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
const headerRow=document.createElement('div');
headerRow.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;';
headerRow.innerHTML=`
<div>
<span style="font-size:1.05em;font-weight:700;color:#2c3e50;">📁 ${entry.folderName}</span>
<span style="font-size:0.8em;color:#6c7a89;margin-left:8px;">${entry.spots.length}spot${entry.spots.length!==1?'s':''}· archived ${dateStr}</span>
${entry.folderWaveCal?'<span style="font-size:0.75em;background:rgba(22,160,133,0.15);border:1px solid #16a085;color:#138d75;border-radius:4px;padding:1px 5px;margin-left:6px;">🌊⚙️ wave cal</span>':''}
</div>
`;
const btnRow=document.createElement('div');
btnRow.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;';
const restoreAllBtn=document.createElement('button');
restoreAllBtn.type='button';
restoreAllBtn.textContent='↩️ Restore All';
restoreAllBtn.style.cssText='padding:7px 14px;background:#27ae60;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9em;';
restoreAllBtn.onclick=()=>{
const count=restoreFolderFromHistory(entry.id);
reloadPlacesKeepSelection();
buildFoldersUI();
refreshSelectedPanel();
populateFolderHistoryList();
if(count>0){
restoreAllBtn.textContent=`✅ Restored ${count}spot${count!==1?'s':''}!`;
setTimeout(()=>populateFolderHistoryList(),2000);
}
};
const deleteBtn=document.createElement('button');
deleteBtn.type='button';
deleteBtn.textContent='🗑 Delete from history';
deleteBtn.style.cssText='padding:7px 14px;background:#e74c3c;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.9em;';
deleteBtn.onclick=()=>{
if(!confirm(`Permanently delete "${entry.folderName}" from history?This cannot be undone.`))return;
deleteHistoryEntry(entry.id);
populateFolderHistoryList();
};
btnRow.appendChild(restoreAllBtn);
btnRow.appendChild(deleteBtn);
const spotsSection=document.createElement('div');
spotsSection.style.cssText='border:1px solid #dee2e6;border-radius:10px;overflow:hidden;margin-top:4px;';
const spotsLabel=document.createElement('div');
spotsLabel.style.cssText='font-size:0.85em;color:#5d6d7e;font-weight:600;padding:8px 10px;background:#f8f9fa;border-bottom:1px solid #dee2e6;';
spotsLabel.textContent='Select individual spots to restore:';
const spotsGrid=document.createElement('div');
spotsGrid.style.cssText='display:grid;gap:0;max-height:220px;overflow-y:scroll;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;';
for(const sp of entry.spots){
const row=document.createElement('label');
row.style.cssText='display:flex;align-items:center;gap:8px;padding:8px 10px;background:white;cursor:pointer;border-bottom:1px solid #f0f0f0;';
const cb=document.createElement('input');
cb.type='checkbox';
cb.dataset.spotKey=sp.key;
cb.style.cssText='width:16px;height:16px;cursor:pointer;flex-shrink:0;';
const calBadges=[
sp._windRules&&sp._windRules.length?'🎯':'',
sp._spotWaveCal?'🌊':''
].filter(Boolean).join('');
row.innerHTML=`<span style="flex:1;font-size:0.9em;color:#2c3e50;font-weight:600;">${sp.name}${calBadges?' '+calBadges:''}</span><span style="font-size:0.78em;color:#95a5a6;">${sp.lat.toFixed(3)}°,${sp.lon.toFixed(3)}°</span>`;
row.prepend(cb);
spotsGrid.appendChild(row);
}
const restoreSelectedBtn=document.createElement('button');
restoreSelectedBtn.type='button';
restoreSelectedBtn.textContent='↩️ Restore Selected';
restoreSelectedBtn.style.cssText='width:100%;padding:10px 14px;background:#3498db;color:white;border:none;border-top:1px solid rgba(0,0,0,0.1);cursor:pointer;font-weight:700;font-size:0.95em;border-radius:0;';
restoreSelectedBtn.onclick=()=>{
const checked=Array.from(spotsGrid.querySelectorAll('input[type=checkbox]:checked')).map(cb=>cb.dataset.spotKey);
if(checked.length===0){
restoreSelectedBtn.textContent='⚠️ Select spots first';
setTimeout(()=>{restoreSelectedBtn.textContent='↩️ Restore Selected';},2000);
return;
}
const count=restoreSpotsFromHistory(entry.id,checked);
reloadPlacesKeepSelection();
buildFoldersUI();
refreshSelectedPanel();
if(count>0){
restoreSelectedBtn.textContent=`✅ Restored ${count}spot${count!==1?'s':''}!`;
setTimeout(()=>{restoreSelectedBtn.textContent='↩️ Restore Selected';},2500);
}
};
spotsSection.appendChild(spotsLabel);
spotsSection.appendChild(spotsGrid);
spotsSection.appendChild(restoreSelectedBtn);
card.appendChild(headerRow);
card.appendChild(btnRow);
card.appendChild(spotsSection);
container.appendChild(card);
}
}
function buildExportBundle(){
const places=getPlaces();
const spotsWithCal=places.map(p=>({
...p,
_windRules:getCalibrationRules(p.key),
_spotWaveCal:getSpotWaveCalibration(p.key),
}));
const folderCals={};
const groups=getAllGroups();
for(const g of groups){
const cal=getFolderWaveCalibration(g);
if(cal)folderCals[g]=cal;
}
return{
version:1,
exportedAt:new Date().toISOString(),
spots:spotsWithCal,
folderWaveCalibrations:folderCals,
folderHistory:getFolderHistory(),
};
}
document.getElementById('exportDataBtn').addEventListener('click',()=>{
const bundle=buildExportBundle();
const json=JSON.stringify(bundle,null,2);
const blob=new Blob([json],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
const date=new Date().toISOString().slice(0,10);
a.href=url;
a.download=`wind-spots-${date}.json`;
a.click();
URL.revokeObjectURL(url);
});
document.getElementById('shareDataBtn').addEventListener('click',async()=>{
const bundle=buildExportBundle();
const json=JSON.stringify(bundle,null,2);
const date=new Date().toISOString().slice(0,10);
const fileName=`wind-spots-${date}.json`;
const file=new File([json],fileName,{type:'application/json'});
if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
try{
await navigator.share({
title:'Wind Spots Backup',
text:'My wind&wave forecast spots backup',
files:[file]
});
}catch(e){
if(e.name!=='AbortError'){
downloadJsonFallback(json,fileName);
}
}
}else{
downloadJsonFallback(json,fileName);
showShareFallbackMsg();
}
});
function downloadJsonFallback(json,fileName){
const blob=new Blob([json],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');
a.href=url;
a.download=fileName;
a.click();
URL.revokeObjectURL(url);
}
function showShareFallbackMsg(){
const btn=document.getElementById('shareDataBtn');
const orig=btn.textContent;
btn.textContent='✅ Downloaded!Now attach in WhatsApp';
btn.style.background='#128C7E';
setTimeout(()=>{
btn.textContent=orig;
btn.style.background='#25D366';
},4000);
}
function importBundle(bundle,mode){
const incoming=Array.isArray(bundle)?bundle:(bundle.spots||[]);
if(!incoming.length)throw new Error('No spots found');
let places=mode==='replace'?[]:getPlaces();
let addedCount=0;
for(const sp of incoming){
if(!sp.key||!sp.name||typeof sp.lat!=='number'||typeof sp.lon!=='number')continue;
const exists=places.some(p=>Math.abs(p.lat-sp.lat)<0.001&&Math.abs(p.lon-sp.lon)<0.001);
if(exists&&mode==='merge')continue;
const{_windRules,_spotWaveCal,...cleanSpot}=sp;
cleanSpot.key='p_'+Date.now().toString(16)+'_'+Math.random().toString(16).slice(2);
places.push(cleanSpot);
if(_windRules&&_windRules.length)setCalibrationRules(cleanSpot.key,_windRules);
if(_spotWaveCal)setSpotWaveCalibration(cleanSpot.key,_spotWaveCal);
addedCount++;
}
savePlaces(places);
if(bundle.folderWaveCalibrations){
for(const [folder,cal] of Object.entries(bundle.folderWaveCalibrations)){
setFolderWaveCalibration(folder,cal);
}
}
if(Array.isArray(bundle.folderHistory)&&bundle.folderHistory.length){
const existingHistory=getFolderHistory();
const existingIds=new Set(existingHistory.map(e=>e.id));
const merged=[...existingHistory];
for(const entry of bundle.folderHistory){
if(!existingIds.has(entry.id))merged.push(entry);
}
saveFolderHistory(merged);
}
reloadPlacesKeepSelection();
buildFoldersUI();
refreshSelectedPanel();
return{addedCount,total:places.length};
}
document.getElementById('importFileInput').addEventListener('change',(e)=>{
const file=e.target.files[0];
if(!file)return;
const status=document.getElementById('importStatus');
status.style.display='none';
const reader=new FileReader();
reader.onload=(ev)=>{
try{
const bundle=JSON.parse(ev.target.result);
const mode=document.querySelector('input[name="importMode"]:checked').value;
const{addedCount,total}=importBundle(bundle,mode);
status.style.display='block';
status.style.background='#d4edda';
status.style.color='#155724';
status.style.border='1px solid #c3e6cb';
status.textContent=mode==='replace'
?`✅ Replaced all data — ${addedCount}spot${addedCount!==1?'s':''}loaded.`
:`✅ Added ${addedCount}new spot${addedCount!==1?'s':''}. Total:${total}.`;
}catch(err){
const status=document.getElementById('importStatus');
status.style.display='block';
status.style.background='#f8d7da';
status.style.color='#721c24';
status.style.border='1px solid #f5c6cb';
status.textContent=`❌ Import failed:${err.message}`;
}
e.target.value='';
};
reader.readAsText(file);
});
const MD_FIELDS=['wind','gust','waveH','waveP'];
function mdEl(id){return document.getElementById(id);}
function updateMyDayInputVisibility(){
for(const f of MD_FIELDS){
const op=mdEl(`md_${f}_op`).value;
const minEl=mdEl(`md_${f}_min`);
const maxEl=mdEl(`md_${f}_max`);
const sepEl=mdEl(`md_${f}_sep`);
if(op==='any'){
minEl.style.display='none';
maxEl.style.display='none';
sepEl.style.display='none';
}else if(op==='between'){
minEl.style.display='';
maxEl.style.display='';
sepEl.style.display='';
}else{
minEl.style.display='';
maxEl.style.display='none';
sepEl.style.display='none';
}
}
}
function loadMyDayForm(){
const prefs=getMyDayPrefs();
if(!prefs){updateMyDayInputVisibility();return;}
for(const f of MD_FIELDS){
if(prefs[`${f}_op`])mdEl(`md_${f}_op`).value=prefs[`${f}_op`];
if(prefs[`${f}_min`]!=null)mdEl(`md_${f}_min`).value=prefs[`${f}_min`];
if(prefs[`${f}_max`]!=null)mdEl(`md_${f}_max`).value=prefs[`${f}_max`];
}
mdEl('md_min_hours').value=prefs.min_hours!=null?prefs.min_hours:'';
mdEl('md_no_rain').checked=!!prefs.no_rain;
updateMyDayInputVisibility();
}
for(const f of MD_FIELDS){
mdEl(`md_${f}_op`).addEventListener('change',updateMyDayInputVisibility);
}
updateMyDayInputVisibility();
mdEl('saveMyDayBtn').addEventListener('click',()=>{
const prefs={};
for(const f of MD_FIELDS){
prefs[`${f}_op`]=mdEl(`md_${f}_op`).value;
prefs[`${f}_min`]=parseFloat(mdEl(`md_${f}_min`).value)||0;
prefs[`${f}_max`]=parseFloat(mdEl(`md_${f}_max`).value)||0;
}
const minHoursVal=parseInt(mdEl('md_min_hours').value);
prefs.min_hours=isNaN(minHoursVal)?null:Math.min(10,Math.max(1,minHoursVal));
prefs.no_rain=mdEl('md_no_rain').checked;
saveMyDayPrefs(prefs);
const st=mdEl('myDayStatus');
st.style.display='inline';
st.textContent='✅ Saved!';
setTimeout(()=>{st.style.display='none';},2000);
applyGoodDayHighlights();
applyGoodDaySpotBadges();
});
mdEl('clearMyDayBtn').addEventListener('click',()=>{
if(!confirm('Clear all My Day rules?'))return;
clearMyDayPrefs();
for(const f of MD_FIELDS){
mdEl(`md_${f}_op`).value=mdEl(`md_${f}_op`).options[0].value;
mdEl(`md_${f}_min`).value='';
mdEl(`md_${f}_max`).value='';
}
mdEl('md_min_hours').value='';
mdEl('md_no_rain').checked=false;
updateMyDayInputVisibility();
applyGoodDayHighlights();
applyGoodDaySpotBadges();
});
const _origSwitchTab=switchSettingsTab;