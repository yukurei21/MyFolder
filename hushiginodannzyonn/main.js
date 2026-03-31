import { createApp } from './app/createApp.js';

export function bootstrap() {
  const app = createApp({
    canvas: document.getElementById('game-canvas'),
    hudRoot: document.getElementById('hud'),
    logRoot: document.getElementById('log'),
  });

  app.start();
  return app;
}

if (typeof document !== 'undefined') {
  window.addEventListener(
    'DOMContentLoaded',
    () => {
      bootstrap();
    },
    { once: true },
  );
}
