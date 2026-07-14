import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Contraparte de browser.ts para entorno Node (tests con Vitest).
// Usa los MISMOS handlers que corren en el navegador real — si esto pasa,
// el contrato de red es correcto independientemente de dónde se ejecute.
export const server = setupServer(...handlers);
