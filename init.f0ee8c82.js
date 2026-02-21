Chart.register(window['chartjs-plugin-annotation']);
ensureDefaultsSeeded();
reloadPlacesKeepSelection();
const lastKey=getLastSelectedKey();
const idx=PLACES.findIndex(p=>p.key===lastKey);
if(idx>=0)currentIndex=idx;
if(PLACES[currentIndex])setLastSelectedKey(PLACES[currentIndex].key);
buildFoldersUI();
setHeader();
refreshSelectedPanel();
setNowBarLoading();
loadForecastForSelected();
refreshRealtimeForAllButtons();
setInterval(refreshRealtimeForAllButtons,10*60*1000);
setInterval(loadForecastForSelected,30*60*1000);
(function(){
const migrated=localStorage.getItem('calibration_migrated_v1');
if(!migrated){
PLACES.forEach(loc=>{
if(loc.applyBonus&&loc.key==='batgalim'){
const existing=getCalibrationRules(loc.key);
if(existing.length===0){
const rule={
sectors:[4,5,6,7],
type:'knots',
value:10,
label:'E-SSE'
};
setCalibrationRules(loc.key,[rule]);
}
}
});
localStorage.setItem('calibration_migrated_v1','true');
}
})();