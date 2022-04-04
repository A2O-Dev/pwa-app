if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}

let installBtn = $('#install-btn');
let listenBtn = $('#listen-btn');
let textArea = $('#textarea');
let labelTextArea = $('#label-textarea');

let deferredPrompt;

let listening = false;
let interval;

installBtn.on('click', () => {
  if (deferredPrompt !== null) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice
      .then(({outcome}) => {
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      });
  }
});

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

window.addEventListener('keyup', ({key}) => {
  if (!['Shift', 'Control', 'AltGraph', 'Alt', 'CapsLock', 'Tab', 'Backspace', 'Escape'].includes(key)) {
    if (key === 'Enter') {
      textArea.val(`${textArea.val()}\n`);
    } else {
      textArea.val(`${textArea.val()}${key}`);
    }
  }
})

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

window.addEventListener('appinstalled', () => {
  installBtn.hide();
});

if (window.matchMedia('(display-mode: standalone)').matches) {
  installBtn.hide();
}
