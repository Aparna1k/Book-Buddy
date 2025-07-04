import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// ✅ Optional: Your global styles (must come after Bootstrap for overrides)
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional performance logging
reportWebVitals();
