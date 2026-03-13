import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { GoogleAuthProvider } from './context/GoogleAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <GoogleAuthProvider>
        <App />
      </GoogleAuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
