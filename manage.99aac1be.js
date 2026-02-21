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
refreshLinkButtons();
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
const dataBtn=document.getElementById('dataBtn');
const camSetBtn=document.getElementById('camSetBtn');
const camModal=document.getElementById('camModal');
const camUrlInput=document.getElementById('camUrlInput');
const dataUrlInput=document.getElementById('dataUrlInput');
const camModalSpotName=document.getElementById('camModalSpotName');
function refreshLinkButtons(){
const loc=PLACES[currentIndex];
if(!loc){
camBtn.style.display='none';
dataBtn.style.display='none';
camSetBtn.style.opacity='0.5';
return;
}
const camUrl=getCamUrl(loc.key);
const dataUrl=getDataUrl(loc.key);
camBtn.style.display=camUrl?'flex':'none';
dataBtn.style.display=dataUrl?'flex':'none';
camSetBtn.style.opacity=(camUrl||dataUrl)?'1':'0.6';
camBtn.title=camUrl?'Open camera:'+camUrl:'';
dataBtn.title=dataUrl?'Open live data:'+dataUrl:'';
}
camBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
const url=loc&&getCamUrl(loc.key);
if(url)window.open(url,'_blank');
});
dataBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
let url=loc&&getDataUrl(loc.key);
if(!url)return;
const stationMatch=url.match(/windguru\.cz\/station\/(\d+)/);
if(stationMatch){
url=`https://www.windguru.cz/wgs-iframe-widget.php?s=${stationMatch[1]}`;
}
window.open(url,'_blank');
});
camSetBtn.addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
camModalSpotName.textContent=loc.name;
camUrlInput.value=getCamUrl(loc.key)||'';
dataUrlInput.value=getDataUrl(loc.key)||'';
camModal.style.display='flex';
setTimeout(()=>camUrlInput.focus(),50);
});
document.getElementById('camSaveBtn').addEventListener('click',()=>{
const loc=PLACES[currentIndex];
if(!loc)return;
let camUrl=camUrlInput.value.trim();
let dataUrl=dataUrlInput.value.trim();
if(camUrl&&!camUrl.startsWith('http'))camUrl='https://'+camUrl;
if(dataUrl&&!dataUrl.startsWith('http'))dataUrl='https://'+dataUrl;
saveCamUrl(loc.key,camUrl);
saveDataUrl(loc.key,dataUrl);
camModal.style.display='none';
refreshLinkButtons();
});
document.getElementById('camCancelBtn').addEventListener('click',()=>{
camModal.style.display='none';
});
camModal.addEventListener('click',(e)=>{
if(e.target===camModal)camModal.style.display='none';
});
[camUrlInput,dataUrlInput].forEach(inp=>{
inp.addEventListener('keydown',(e)=>{
if(e.key==='Enter')document.getElementById('camSaveBtn').click();
});
});