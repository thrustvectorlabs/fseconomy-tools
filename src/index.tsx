import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';

import { App } from './components/app';
import { runSiteEnhancers } from './site-enhancers';

function mountApp() {
  const containerId = 'fset-container';
  const headContainer = document.querySelector('head');
  let container = document.getElementById(containerId);

  if (headContainer) {
    headContainer.insertAdjacentHTML(
      'beforeend',
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">',
    );
  }

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.insertBefore(container, document.body.firstChild);
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  runSiteEnhancers();
  console.info('FSE Tools loaded.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
