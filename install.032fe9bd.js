// PWA Install functionality
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const installBackdrop = document.getElementById('installBackdrop');
const closeInstallBtn = document.getElementById('closeInstallBtn');

// Detect device type and show appropriate instructions
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    document.getElementById('install-ios').style.display = 'block';
    document.getElementById('install-android').style.display = 'none';
    document.getElementById('install-generic').style.display = 'none';
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    document.getElementById('install-ios').style.display = 'none';
    document.getElementById('install-android').style.display = 'block';
    document.getElementById('install-generic').style.display = 'none';
    return 'android';
  }
  
  // Other devices
  document.getElementById('install-ios').style.display = 'none';
  document.getElementById('install-android').style.display = 'none';
  document.getElementById('install-generic').style.display = 'block';
  return 'other';
}

// Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button
  installBtn.style.display = 'flex';
});

// Handle install button click
installBtn.addEventListener('click', async () => {
  const deviceType = detectDevice();
  
  // For browsers that support PWA install prompt (Chrome, Edge)
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      installBtn.style.display = 'none';
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    deferredPrompt = null;
  } else {
    // For iOS and other browsers, show manual instructions
    detectDevice();
    installBackdrop.style.display = 'flex';
    installBackdrop.setAttribute('aria-hidden', 'false');
  }
});

// Close install modal
closeInstallBtn.addEventListener('click', () => {
  installBackdrop.style.display = 'none';
  installBackdrop.setAttribute('aria-hidden', 'true');
});

// Close on backdrop click
installBackdrop.addEventListener('click', (e) => {
  if (e.target === installBackdrop) {
    installBackdrop.style.display = 'none';
    installBackdrop.setAttribute('aria-hidden', 'true');
  }
});

// Listen for app installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  installBtn.style.display = 'none';
  
  // Hide the button permanently (user has installed)
  localStorage.setItem('pwa_installed', 'true');
});

// Check if already installed
if (localStorage.getItem('pwa_installed') === 'true') {
  installBtn.style.display = 'none';
}

// Check if running as installed app
if (window.matchMedia('(display-mode: standalone)').matches) {
  // App is running as installed PWA
  installBtn.style.display = 'none';
  localStorage.setItem('pwa_installed', 'true');
}

// For iOS, check if running in standalone mode
if (window.navigator.standalone === true) {
  // App is running as installed on iOS
  installBtn.style.display = 'none';
  localStorage.setItem('pwa_installed', 'true');
}

// Show install button on mobile devices after a delay (if not installed)
setTimeout(() => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isInstalled = localStorage.getItem('pwa_installed') === 'true';
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  
  if (isMobile && !isInstalled && !isStandalone && !deferredPrompt) {
    // Show install button for mobile users (especially iOS)
    installBtn.style.display = 'flex';
  }
}, 3000); // Show after 3 seconds
