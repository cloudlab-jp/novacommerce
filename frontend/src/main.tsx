import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mientras el backend real no existe, VITE_USE_MOCKS activa MSW para
// interceptar las llamadas Axios y responder con datos quemados — el
// front-end nunca se entera de la diferencia (mismos interceptores,
// mismo manejo de errores, misma forma de las respuestas).
async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
