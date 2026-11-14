import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element is missing.');

// Intentionally no StrictMode: its dev-only double mount would revoke the
// object URL / close the ImageBitmap that is still held in state.
createRoot(container).render(<App />);
