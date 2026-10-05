import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './fonts';
import { MotionConfig } from 'framer-motion';
import { installOfflineGuards, installMotionGuards, registerServiceWorker } from './offline';

installOfflineGuards();
installMotionGuards();
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
