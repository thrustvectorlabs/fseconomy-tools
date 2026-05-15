import { SiteEnhancerDefinition } from './types';

const AIRCRAFT_LOG_PATHNAME = 'aircraftlog.jsp';

const getAircraftLogElements = () => ({
  aircraftCurrentLocationIcaoElement: document.querySelector<HTMLElement>(
    '#wrapper > div > div:nth-child(1) > form > table:nth-child(5) > tbody > tr > td:nth-child(5)',
  ),
  aircraftHomeIcaoElement: document.querySelector<HTMLElement>(
    '#wrapper > div > div:nth-child(1) > form > table:nth-child(5) > tbody > tr > td:nth-child(4)',
  ),
});

export const enhanceAircraftLog = () => {
  // Modifiers
  if (window.location.href.split('?')[0].indexOf(AIRCRAFT_LOG_PATHNAME) !== -1) {
    const { aircraftCurrentLocationIcaoElement, aircraftHomeIcaoElement } = getAircraftLogElements();

    if (!aircraftCurrentLocationIcaoElement || !aircraftHomeIcaoElement) {
      console.warn('One or more required elements are missing on the page.');
      return;
    }

    const currentLocationLink = `<a href="https://server.fseconomy.net/airport.jsp?icao=${aircraftCurrentLocationIcaoElement.innerText}">${aircraftCurrentLocationIcaoElement.innerText}</a>`;
    const aircraftHomeIcaoLink = `<a href="https://server.fseconomy.net/airport.jsp?icao=${aircraftHomeIcaoElement.innerText}">${aircraftHomeIcaoElement.innerText}</a>`;

    aircraftCurrentLocationIcaoElement.innerHTML = currentLocationLink;
    aircraftHomeIcaoElement.innerHTML = aircraftHomeIcaoLink;
  }
};

export const aircraftLogEnhancer: SiteEnhancerDefinition = {
  id: 'aircraftlog',
  debugLabel: 'Aircraft Log',
  matchesCurrentPage: () => window.location.href.split('?')[0].indexOf(AIRCRAFT_LOG_PATHNAME) !== -1,
  enhance: enhanceAircraftLog,
  getDebugInfo: () => {
    const { aircraftCurrentLocationIcaoElement, aircraftHomeIcaoElement } = getAircraftLogElements();

    return {
      currentLocationText: aircraftCurrentLocationIcaoElement?.innerText.trim() ?? null,
      currentLocationContainsLink: !!aircraftCurrentLocationIcaoElement?.querySelector('a'),
      homeIcaoText: aircraftHomeIcaoElement?.innerText.trim() ?? null,
      homeIcaoContainsLink: !!aircraftHomeIcaoElement?.querySelector('a'),
      requiredElementsPresent: {
        aircraftCurrentLocationIcaoElement: !!aircraftCurrentLocationIcaoElement,
        aircraftHomeIcaoElement: !!aircraftHomeIcaoElement,
      },
    };
  },
};
