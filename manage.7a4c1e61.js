const selTitleEl=document.getElementById('sel_title');
const selSubEl=document.getElementById('sel_sub');
const deleteSelBtn=document.getElementById('deleteSelBtn');
const editLocationBtn=document.getElementById('editLocationBtn');
function refreshSelectedPanel(){
const loc=PLACES[currentIndex];
if(!loc){
selTitleEl.textContent='—';
selSubEl.textContent='—';
deleteSelBtn.disabled=true;
editLocationBtn.style.display='none';
return;
}
selTitleEl.textContent=loc.name;
const folder='📁 '+normalizeGroupName(loc.group);
const bm=(typeof getBestMonthForSpot==='function')?getBestMonthForSpot(loc):null;
if(bm){
selSubEl.innerHTML=folder+'&nbsp;·&nbsp;<span style="color:#e67e22;font-weight:700;">🗓️ Best:'+bm.months+'</span><span style="color:#95a5a6;font-size:0.88em;">('+bm.note+')</span>';
}else{
selSubEl.textContent=folder;
}
editLocationBtn.style.display='flex';
deleteSelBtn.disabled=false;
refreshCamButton();
}
editLocationBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
window.isEditingSpot=true;
window.editingSpotKey=loc.key;
openMap();
});
deleteSelBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
const ok=confirm(`Delete "${loc.name}"?\n\nThe spot will be moved to History — you can restore it later from Settings → History.`);
if(!ok)return;
deletePlace(loc.key);
reloadPlacesKeepSelection();
buildFoldersUI();
setHeader();
refreshSelectedPanel();
loadForecastForSelected();
refreshRealtimeForAllButtons();
});
const camBtn=document.getElementById('camBtn');
const camSetBtn=document.getElementById('camSetBtn');
const camModal=document.getElementById('camModal');
const camUrlInput=document.getElementById('camUrlInput');
const camModalSpotName=document.getElementById('camModalSpotName');
function refreshCamButton(){
const loc=PLACES[currentIndex];
if(!loc){
camBtn.style.display='none';
camSetBtn.style.opacity='0.5';
return;
}
const url=getCamUrl(loc.key);
if(url){
camBtn.style.display='flex';
camBtn.title='Open live camera:'+url;
camSetBtn.style.opacity='1';
camSetBtn.title='Edit camera URL';
}else{
camBtn.style.display='none';
camSetBtn.style.opacity='0.5';
camSetBtn.title='Set camera URL for this spot';
}
}
camBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
const url=getCamUrl(loc.key);
if(url)window.open(url,'_blank');
});
camSetBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
camModalSpotName.textContent=loc.name;
camUrlInput.value=getCamUrl(loc.key)||'';
camModal.style.display='flex';
setTimeout(()=>camUrlInput.focus(),50);
});
document.getElementById('camSaveBtn').addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
let url=camUrlInput.value.trim();
if(url&&!url.startsWith('http'))url='https://'+url;
saveCamUrl(loc.key,url);
camModal.style.display='none';
refreshCamButton();
});
document.getElementById('camClearBtn').addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
saveCamUrl(loc.key,'');
camUrlInput.value='';
camModal.style.display='none';
refreshCamButton();
});
document.getElementById('camCancelBtn').addEventListener('click',()=>{
camModal.style.display='none';
});
camModal.addEventListener('click',(e)=>{
if(e.target===camModal)camModal.style.display='none';
});
camUrlInput.addEventListener('keydown',(e)=>{
if(e.key==='Enter')document.getElementById('camSaveBtn').click();
});