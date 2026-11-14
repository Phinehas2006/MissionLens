import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './styles/global.css';
import { LanguageProvider } from './i18n/LanguageProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><LanguageProvider><BrowserRouter><App /></BrowserRouter></LanguageProvider></React.StrictMode>,
);
