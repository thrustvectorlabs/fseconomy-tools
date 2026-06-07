import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';

import { App } from './components/app';
import { runSiteEnhancers } from './site-enhancers';

function mountApp() {
  const containerId = 'fset-container';
  let container = document.getElementById(containerId);

  const updateLayoutAnchors = () => {
    const nav = document.getElementById('nav');
    const header = document.querySelector<HTMLElement>('.header.loggedin, .header');
    const root = document.documentElement;

    const navRect = nav?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();

    const launcherTop = navRect ? navRect.top + navRect.height / 2 : 144;
    const launcherRight = navRect ? Math.max(window.innerWidth - navRect.right, 24) + 24 : 24;
    const drawerTop = navRect ? navRect.bottom + 12 : (headerRect?.bottom ?? 120) + 12;

    root.style.setProperty('--fset-launcher-top', `${launcherTop}px`);
    root.style.setProperty('--fset-launcher-right', `${launcherRight}px`);
    root.style.setProperty('--fset-drawer-top', `${drawerTop}px`);
  };

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    document.body.appendChild(container);
  }

  updateLayoutAnchors();
  window.addEventListener('resize', updateLayoutAnchors);
  window.addEventListener('scroll', updateLayoutAnchors, { passive: true });

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
