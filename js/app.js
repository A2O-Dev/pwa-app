
if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('/serviceWorker.js')
}

let installBtn = $('#install-btn');

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
});

installBtn.on('click', async () => {
  if (deferredPrompt !== null) {
    deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
    }
  }
});

window.addEventListener('appinstalled', () => {
  installBtn.hide();
});

if (window.matchMedia('(display-mode: standalone)').matches) {
  installBtn.hide();
}
