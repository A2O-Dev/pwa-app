if (!!navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}

let readValue = '';

let installBtn = $('#install-btn');
let listenBtn = $('#listen-btn');
let clearBtn = $('#clear-btn');
let textArea = $('#textarea');

let deferredPrompt;

let listening = false;
let buttonListeningInterval;

const onButtonListening = () => {
  listenBtn.blur();
  listenBtn.removeClass('btn-primary');
  listenBtn.addClass('btn-success');
  listenBtn.text('Listening...');
  listenBtn.css('width', '105px');
  clearBtn.show();
  buttonListeningInterval = setInterval(() => {
    let text = '';
    switch (listenBtn.text()) {
      case 'Listening':
        text = 'Listening.';
        break;
      case 'Listening.':
        text = 'Listening..';
        break;
      case 'Listening..':
        text = 'Listening...';
        break;
      case 'Listening...':
        text = 'Listening';
        break;
      default:
        break;
    }
    listenBtn.text(text);
  }, 500);
}

const offButtonListening = () => {
  listenBtn.blur();
  listenBtn.removeClass('btn-success');
  listenBtn.addClass('btn-primary');
  clearInterval(buttonListeningInterval);
  listenBtn.css('width', '130px');
  listenBtn.text('Start to Listen');
  clearBtn.hide();
}

const writeValueInHtml = (value) => {
  const htmlToShow = value.replaceAll('\n', '</br>');
  textArea.html(htmlToShow);
}

const captureValue = ({key}) => {
  if (!['Shift', 'Control', 'AltGraph', 'Alt', 'CapsLock', 'Tab', 'Backspace', 'Escape'].includes(key)) {
    readValue += key === 'Enter' ? '\n' : key;
    writeValueInHtml(readValue);
  }
}

const clearReadValue = () => {
  readValue = '';
  writeValueInHtml(readValue);
}

clearBtn.on('click', clearReadValue);
clearBtn.on('focus', () => clearBtn.blur());

listenBtn.on('click', () => {
  listening = !listening;
  if (listening) {
    clearReadValue();
    $(window).on('keyup', captureValue);
    onButtonListening();
  } else {
    $(window).off('keyup');
    offButtonListening();
  }
});

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
