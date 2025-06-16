import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initAuthPersistence } from './config/initFirebase';

initAuthPersistence().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
