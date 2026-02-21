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