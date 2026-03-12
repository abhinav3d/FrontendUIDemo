import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { seedMockDatabase } from './mocks/mockDatabaseSeeder';

// 🧪 Initialize Mock Database if enabled
if (import.meta.env.VITE_USE_MOCK === 'true') {
  seedMockDatabase().catch(console.error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
