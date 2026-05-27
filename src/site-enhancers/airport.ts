import { airportsWithoutIcao, nonExistingAirports } from '../data/airportMap';
import { parseAirportCoordinates } from '../utils/coordinates';
import { findFirstElementByText, getTextContent } from '../utils/dom';
import { getCorrectedAirportForIcao } from '../utils/airport';
import { SiteEnhancerDefinition } from './types';

const ENHANCER_ID = 'fset-airport-enhancer';
const AIRPORT_PATHNAME = '/airport.jsp';

const createBadge = (): HTMLSpanElement => {
  const badge = document.createElement('span');
  badge.className = 'fset-badge';
  badge.textContent = 'FSE Tools';
  badge.style.display = 'inline-block';
  badge.style.background = 'linear-gradient(to bottom, #66bb6a, #43a047)';
  badge.style.color = '#fff';
  badge.style.fontSize = '14px';
  badge.style.fontWeight = '700';
  badge.style.padding = '4px 8px';
  badge.style.borderRadius = '3px';
  badge.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  return badge;
};

const createPanel = (): HTMLDivElement => {
  const panel = document.createElement('div');
  panel.id = ENHANCER_ID;
  panel.style.border = '1px solid #d8dee4';
  panel.style.borderRadius = '6px';
  panel.style.backgroundColor = '#f8fafc';
  panel.style.padding = '12px 14px';
  panel.style.margin = '16px 0';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '10px';
  return panel;
};

const createRow = (): HTMLDivElement => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '10px';
  row.style.flexWrap = 'wrap';
  return row;
};

const createLinkRow = (label: string, href: string): HTMLDivElement => {
  const row = createRow();
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = label;
  row.append(link);
  return row;
};

const createButtonRow = (label: string, onClick: () => void): HTMLDivElement => {
  const row = createRow();
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.style.cursor = 'pointer';
  button.style.border = '1px solid #bec8d2';
  button.style.backgroundColor = '#fff';
  button.style.borderRadius = '4px';
  button.style.padding = '6px 10px';
  button.addEventListener('click', onClick);
  row.append(button);
  return row;
};

const createMessageRow = (message: string): HTMLDivElement => {
  const row = createRow();
  row.textContent = message;
  return row;
};

const findAirportRoot = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('#mainContentDiv > div.row.clearfix');

const findAirportHeaderRoot = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('div.panel-heading.airportInfo');

const findAirportIcaoHeadingElement = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('div.panel-heading.airportInfo h1');

const findCoordinatesElement = (root: ParentNode): HTMLElement | null =>
  findFirstElementByText<HTMLElement>(root, 'div', (text) =>
    /Lat:\s*[0-9.]+\s*[NS].*Long:\s*[0-9.]+\s*[EW]/i.test(text),
  );

const findElevationElement = (root: ParentNode): HTMLElement | null =>
  findFirstElementByText<HTMLElement>(root, 'div, p, span, td, li', (text) => /^Elevation:/i.test(text));

const getAirportIcaoFromDom = (): string | null => {
  const headingText = getTextContent(findAirportIcaoHeadingElement());
  if (/^[A-Z0-9]{3,4}$/i.test(headingText)) {
    return headingText.toUpperCase();
  }

  const icaoInput = document.querySelector<HTMLInputElement>('input[name="icao"][value]');
  const inputValue = icaoInput?.value?.trim().toUpperCase();
  if (inputValue && /^[A-Z0-9]{3,4}$/i.test(inputValue)) {
    return inputValue;
  }

  return null;
};

const getAirportIcao = (): { source: 'dom' | 'query'; value: string | null } => {
  const domIcao = getAirportIcaoFromDom();
  if (domIcao) {
    return { source: 'dom', value: domIcao };
  }

  const urlIcao = new URL(window.location.href).searchParams.get('icao')?.trim().toUpperCase() ?? null;
  return { source: 'query', value: urlIcao };
};

const getNearestAirports = () => {
  const table = Array.from(document.querySelectorAll<HTMLTableElement>('table')).find((candidate) =>
    getTextContent(candidate.querySelector('th')).includes('Close Airports'),
  );

  if (!table) {
    return [];
  }

  return Array.from(table.querySelectorAll('tbody tr'))
    .map((row) => {
      const cells = row.querySelectorAll('td');
      const airportLink = cells[0]?.querySelector<HTMLAnchorElement>('a[href*="airport.jsp?icao="]');
      const distanceText = getTextContent(cells[1]);
      const distanceMatch = distanceText.match(/([0-9.]+)\s*nm/i);

      if (!airportLink) {
        return null;
      }

      return {
        icao: getTextContent(airportLink),
        distanceNm: distanceMatch ? Number.parseFloat(distanceMatch[1]) : null,
      };
    })
    .filter((airport): airport is NonNullable<typeof airport> => airport !== null);
};

const buildAirportWarning = (icao: string): string | null => {
  if (airportsWithoutIcao.includes(icao)) {
    return `Warning: ICAO ${icao} has no real-world ICAO code. Use the airport name or coordinates in MSFS.`;
  }

  const correctedIcao = getCorrectedAirportForIcao(icao);
  if (correctedIcao) {
    return `Warning: ICAO ${icao} does not exist in MSFS. In MSFS it is known as ${correctedIcao}.`;
  }

  if (nonExistingAirports.includes(icao)) {
    return `Warning: ICAO ${icao} does not exist in MSFS. Use the coordinates to find the airport manually.`;
  }

  return null;
};

const updateIcaoHeading = (element: HTMLElement | null, icao: string): void => {
  if (!element) {
    return;
  }

  const correctedIcao = getCorrectedAirportForIcao(icao);
  if (correctedIcao) {
    element.innerHTML = `<span style="text-decoration: line-through; color: #c00;">${icao}</span> <span style="padding: 0 3px;">→</span><span>${correctedIcao}</span>`;
    return;
  }

  if (nonExistingAirports.includes(icao) || airportsWithoutIcao.includes(icao)) {
    element.innerHTML = `<span style="text-decoration: line-through; color: #c00;">${icao}</span> <span title="Needs manual lookup">⚠</span>`;
  }
};

export const enhanceAirport = () => {
  const url = new URL(window.location.href);
  if (!url.pathname.endsWith(AIRPORT_PATHNAME)) {
    return;
  }

  const { value: icao } = getAirportIcao();
  if (!icao) {
    return;
  }

  if (document.getElementById(ENHANCER_ID)) {
    return;
  }

  const airportRoot = findAirportRoot();
  if (!airportRoot) {
    console.warn('FSE Tools: airport info root not found.');
    return;
  }

  const coordinatesElement = findCoordinatesElement(airportRoot);
  if (!coordinatesElement) {
    console.warn('FSE Tools: airport coordinates not found.');
    return;
  }

  const coordinates = parseAirportCoordinates(getTextContent(coordinatesElement));
  if (!coordinates) {
    console.warn('FSE Tools: airport coordinates could not be parsed.');
    return;
  }

  updateIcaoHeading(findAirportIcaoHeadingElement(), icao);

  const panel = createPanel();

  const headerRow = createRow();
  headerRow.append(createBadge());
  const title = document.createElement('strong');
  title.textContent = 'Airport helpers';
  headerRow.append(title);
  panel.append(headerRow);

  panel.append(
    createLinkRow(
      'View airport on Google Maps',
      `https://www.google.com/maps/@?api=1&map_action=map&center=${coordinates.googleMapsCenter}&zoom=14&basemap=satellite`,
    ),
  );

  panel.append(
    createButtonRow(`Copy coordinates for MSFS (${coordinates.msfs})`, async () => {
      await navigator.clipboard.writeText(coordinates.msfs);
      window.alert(`Copied ${coordinates.msfs} to the clipboard.`);
    }),
  );

  const airportWarning = buildAirportWarning(icao);
  if (airportWarning) {
    panel.append(createMessageRow(airportWarning));
  }

  const anchor = findElevationElement(airportRoot) ?? coordinatesElement;
  anchor.insertAdjacentElement('afterend', panel);
};

export const airportEnhancer: SiteEnhancerDefinition = {
  id: 'airport',
  debugLabel: 'Airport',
  matchesCurrentPage: () => new URL(window.location.href).pathname.endsWith(AIRPORT_PATHNAME),
  enhance: enhanceAirport,
  getDebugInfo: () => {
    const url = new URL(window.location.href);
    const icao = getAirportIcao();
    const airportRoot = findAirportRoot();
    const airportHeaderRoot = findAirportHeaderRoot();
    const coordinatesElement = airportRoot ? findCoordinatesElement(airportRoot) : null;
    const elevationElement = airportRoot ? findElevationElement(airportRoot) : null;
    const parsedCoordinates = coordinatesElement ? parseAirportCoordinates(getTextContent(coordinatesElement)) : null;
    const nearestAirports = getNearestAirports();

    return {
      enhancerPanelInjected: !!document.getElementById(ENHANCER_ID),
      icao: icao.value,
      icaoSource: icao.source,
      queryIcao: url.searchParams.get('icao')?.trim().toUpperCase() ?? null,
      domIcao: getAirportIcaoFromDom(),
      airportRootFound: !!airportRoot,
      airportHeaderRootFound: !!airportHeaderRoot,
      coordinatesElementFound: !!coordinatesElement,
      coordinatesText: getTextContent(coordinatesElement),
      parsedCoordinates,
      elevationElementFound: !!elevationElement,
      correctedIcao: icao.value ? (getCorrectedAirportForIcao(icao.value) ?? null) : null,
      hasAirportWithoutIcaoWarning: icao.value ? airportsWithoutIcao.includes(icao.value) : false,
      hasNonExistingAirportWarning: icao.value ? nonExistingAirports.includes(icao.value) : false,
      nearestAirports,
    };
  },
};
