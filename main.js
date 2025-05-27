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
