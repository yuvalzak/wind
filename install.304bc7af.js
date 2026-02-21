let deferredPrompt;
const installBanner=document.getElementById('installBanner');
const installBtn=document.getElementById('installBtn');
const installBackdrop=document.getElementById('installBackdrop');
const closeInstallBtn=document.getElementById('closeInstallBtn');
function showInstallBanner(){
if(installBanner)installBanner.style.display='flex';
}
function hideInstallBanner(){
if(installBanner)installBanner.style.display='none';
}
function detectDevice(){
const userAgent=navigator.userAgent||navigator.vendor||window.opera;
if(/iPad|iPhone|iPod/.test(userAgent)&&!window.MSStream){
document.getElementById('install-ios').style.display='block';
document.getElementById('install-android').style.display='none';
document.getElementById('install-generic').style.display='none';
return 'ios';
}
if(/android/i.test(userAgent)){
document.getElementById('install-ios').style.display='none';
document.getElementById('install-android').style.display='block';
document.getElementById('install-generic').style.display='none';
return 'android';
}
document.getElementById('install-ios').style.display='none';
document.getElementById('install-android').style.display='none';
document.getElementById('install-generic').style.display='block';
return 'other';
}
window.addEventListener('beforeinstallprompt',(e)=>{
e.preventDefault();
deferredPrompt=e;
showInstallBanner();
});
installBtn.addEventListener('click',async()=>{
if(deferredPrompt){
deferredPrompt.prompt();
const{outcome}=await deferredPrompt.userChoice;
if(outcome==='accepted'){
hideInstallBanner();
localStorage.setItem('pwa_installed','true');
}
deferredPrompt=null;
}else{
detectDevice();
installBackdrop.style.display='flex';
installBackdrop.setAttribute('aria-hidden','false');
}
});
closeInstallBtn.addEventListener('click',()=>{
installBackdrop.style.display='none';
installBackdrop.setAttribute('aria-hidden','true');
});
installBackdrop.addEventListener('click',(e)=>{
if(e.target===installBackdrop){
installBackdrop.style.display='none';
installBackdrop.setAttribute('aria-hidden','true');
}
});
window.addEventListener('appinstalled',()=>{
hideInstallBanner();
localStorage.setItem('pwa_installed','true');
});
function checkAlreadyInstalled(){
const isInstalled=localStorage.getItem('pwa_installed')==='true';
const isStandalone=window.matchMedia('(display-mode:standalone)').matches||window.navigator.standalone===true;
if(isInstalled||isStandalone){
hideInstallBanner();
if(isStandalone)localStorage.setItem('pwa_installed','true');
return true;
}
return false;
}
checkAlreadyInstalled();
setTimeout(()=>{
if(checkAlreadyInstalled())return;
const isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if(isMobile&&!deferredPrompt){
showInstallBanner();
}
},2000);