
if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}

let installBtn = $('#install-btn');
let listenBtn = $('#listen-btn');
let textArea = $('#textarea');
let labelTextArea = $('#label-textarea');

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

let listening = false;
let interval;

$(function () {

  listenBtn.on('click', () => {
    listening = !listening;

    if (listening) {
      listenBtn.removeClass('btn-primary');
      listenBtn.addClass('btn-success');
      interval = setInterval(() => {
        textArea.focus();
      }, 100);
      listenBtn.text('Listening...');
      labelTextArea.text('Listening...');
    } else {
      listenBtn.removeClass('btn-success');
      listenBtn.addClass('btn-primary');
      clearInterval(interval);
      listenBtn.text('Start to Listen');
      labelTextArea.text('Stopped');
    }
  })

  $(window).keyup(({key}) => {
    if (!['Shift', 'Control', 'AltGraph', 'Alt', 'CapsLock', 'Tab', 'Backspace', 'Escape'].includes(key)) {
      if (key === 'Enter') {
        textArea.val(`${textArea.val()}\n`);
      } else {
        textArea.val(`${textArea.val()}${key}`);
      }
    }
  });
});
