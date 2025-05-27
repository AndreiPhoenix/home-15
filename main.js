if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Предотвращаем автоматическое отображение подсказки
  e.preventDefault();
  // Сохраняем событие для использования позже
  deferredPrompt = e;
  // Показываем кнопку установки
  document.getElementById('installButton').style.display = 'block';
});

document.getElementById('installButton').addEventListener('click', () => {
  // Скрываем кнопку
  document.getElementById('installButton').style.display = 'none';
  // Показываем подсказку установки
  deferredPrompt.prompt();
  // Ждем ответа пользователя
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Пользователь согласился установить PWA');
    } else {
      console.log('Пользователь отказался от установки PWA');
    }
    deferredPrompt = null;
  });
});

window.addEventListener('appinstalled', (evt) => {
  console.log('Приложение успешно установлено');
});

// Запрос разрешения на уведомления
function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Разрешение на уведомления получено');
      registerPush();
    } else {
      console.log('Разрешение на уведомления не получено');
    }
  });
}

// Регистрация Push
function registerPush() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker не поддерживается');
    return;
  }

  navigator.serviceWorker.ready.then(registration => {
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('ВАШ_PUBLIC_VAPID_KEY')
    })
    .then(subscription => {
      console.log('Подписка на Push успешна:', subscription);
      // Отправьте subscription на ваш сервер для хранения
    })
    .catch(err => {
      console.log('Ошибка подписки на Push:', err);
    });
  });
}

// Вспомогательная функция для преобразования ключа
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Вызов при загрузке или по действию пользователя
document.getElementById('enableNotifications').addEventListener('click', () => {
  requestNotificationPermission();
});
