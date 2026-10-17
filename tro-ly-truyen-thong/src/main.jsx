import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { UIProvider } from './components/UI.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </React.StrictMode>
);
