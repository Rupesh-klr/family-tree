import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
// Ensure BiometricGate.jsx is copied from your previous project to src/components/Auth/
import BiometricGate from './components/Auth/BiometricGate'; 
import { store, persistor } from './store/store.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          {/* Toaster for global notifications */}
          <Toaster position="bottom-right" />
          
          {/* 🔒 THE SECURITY GATE (Reused) */}
          <BiometricGate>
            <App />
          </BiometricGate>

        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);