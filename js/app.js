
if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('/serviceWorker.js')
}

window.addEventListener('appinstalled', () => {
  $('#install-btn').hide();
});

if (window.matchMedia('(display-mode: standalone)').matches) {
  $('#install-btn').hide();
}
