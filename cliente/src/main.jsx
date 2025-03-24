import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Modal from 'react-modal';
import { registerSW } from './registerSW'

// Configurar el elemento raíz del modal
Modal.setAppElement('#root');
// Registrar el service worker
registerSW();

createRoot(document.getElementById('root')).render( <App />)
