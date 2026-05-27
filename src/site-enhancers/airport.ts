import { airportsWithoutIcao, nonExistingAirports } from '../data/airportMap';
import msfs2020Airports from '../data/msfs-2020-airports.json';
import { parseAirportCoordinates } from '../utils/coordinates';
import { findFirstElementByText, getTextContent } from '../utils/dom';
import { getCorrectedAirportForIcao } from '../utils/airport';
import { SiteEnhancerDefinition } from './types';

const ENHANCER_ID = 'fset-airport-enhancer';
const AIRPORT_PATHNAME = '/airport.jsp';
const MSFS_COORDINATE_PRECISION = 100;

type Msfs2020Airport = {
  ident: string;
  laty: number;
  lonx: number;
  name: string;
};

type ValidationStatus =
  | { ok: true }
  | {
      ok: false;
      message: string;
    };

type MsfsValidationResult = {
  airport: Msfs2020Airport | null;
  renamedAirport: Msfs2020Airport | null;
  icaoStatus: ValidationStatus;
  coordinateStatus: ValidationStatus;
};

const msfsAirportByIdent = new Map(
  (msfs2020Airports as Msfs2020Airport[]).map((airport) => [airport.ident.toUpperCase(), airport]),
);

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

const createSectionsRow = (): HTMLDivElement => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  row.style.gap = '12px';
  return row;
};

const createSectionCard = (title: string, hasWarning: boolean): HTMLDivElement => {
  const card = document.createElement('div');
  card.style.flex = '1 1 280px';
  card.style.minWidth = '280px';
  card.style.border = hasWarning ? '1px solid #e6b8b7' : '1px solid #d8dee4';
  card.style.borderRadius = '6px';
  card.style.background = hasWarning ? 'linear-gradient(180deg, #fff5f5 0%, #fde9e8 100%)' : '#ffffff';
  card.style.padding = '12px';
  card.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.06)';

  const heading = document.createElement('div');
  heading.textContent = title;
  heading.style.fontSize = '13px';
  heading.style.fontWeight = '700';
  heading.style.color = '#334155';
  heading.style.marginBottom = '8px';
  heading.style.textTransform = 'uppercase';
  heading.style.letterSpacing = '0.04em';
  card.append(heading);

  return card;
};

const createStatusItem = (label: string, status: ValidationStatus): HTMLDivElement => {
  const item = document.createElement('div');
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.justifyContent = 'space-between';
  item.style.gap = '10px';
  item.style.padding = '8px 10px';
  item.style.borderRadius = '4px';
  item.style.backgroundColor = 'rgba(248, 250, 252, 0.85)';

  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  labelElement.style.color = '#0f172a';
  item.append(labelElement);

  const icon = document.createElement('span');
  icon.textContent = status.ok ? '✓' : '⚠';
  icon.style.fontSize = '16px';
  icon.style.fontWeight = '700';
  icon.style.color = status.ok ? '#2e7d32' : '#c2410c';
  if (!status.ok) {
    icon.title = status.message;
    icon.style.cursor = 'help';
  }
  item.append(icon);

  return item;
};

const createInfoItem = (message: string): HTMLDivElement => {
  const item = document.createElement('div');
  item.textContent = message;
  item.style.padding = '8px 10px';
  item.style.borderRadius = '4px';
  item.style.backgroundColor = 'rgba(220, 252, 231, 0.6)';
  item.style.color = '#166534';
  item.style.fontWeight = '600';
  return item;
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

const truncateCoordinate = (value: number): number =>
  Math.trunc(value * MSFS_COORDINATE_PRECISION) / MSFS_COORDINATE_PRECISION;

const formatCoordinateForTooltip = (value: number): string => truncateCoordinate(value).toFixed(3);

const findRenamedMsfsAirport = (coordinates: { latitude: number; longitude: number }): Msfs2020Airport | null => {
  const fseLatitude = truncateCoordinate(coordinates.latitude);
  const fseLongitude = truncateCoordinate(coordinates.longitude);
  const matches = (msfs2020Airports as Msfs2020Airport[]).filter(
    (airport) => truncateCoordinate(airport.laty) === fseLatitude && truncateCoordinate(airport.lonx) === fseLongitude,
  );

  return matches.length === 1 ? matches[0] : null;
};

const getMsfsValidation = (
  icao: string,
  coordinates: { latitude: number; longitude: number },
): MsfsValidationResult => {
  const airport = msfsAirportByIdent.get(icao.toUpperCase()) ?? null;
  const icaoStatus: ValidationStatus = airport
    ? { ok: true }
    : { ok: false, message: `ICAO ${icao} was not found in the MSFS 2020 airport dataset.` };

  if (!airport) {
    const renamedAirport = findRenamedMsfsAirport(coordinates);
    const coordinateStatus: ValidationStatus = renamedAirport
      ? { ok: true }
      : {
          ok: false,
          message: 'Position could not be matched to a unique MSFS 2020 airport.',
        };

    return {
      airport: null,
      renamedAirport,
      icaoStatus,
      coordinateStatus,
    };
  }

  const fseLatitude = truncateCoordinate(coordinates.latitude);
  const fseLongitude = truncateCoordinate(coordinates.longitude);
  const msfsLatitude = truncateCoordinate(airport.laty);
  const msfsLongitude = truncateCoordinate(airport.lonx);
  const coordinatesMatch = fseLatitude === msfsLatitude && fseLongitude === msfsLongitude;

  const coordinateStatus: ValidationStatus = coordinatesMatch
    ? { ok: true }
    : {
        ok: false,
        message: `FSE ${formatCoordinateForTooltip(coordinates.latitude)}, ${formatCoordinateForTooltip(coordinates.longitude)} vs MSFS ${formatCoordinateForTooltip(airport.laty)}, ${formatCoordinateForTooltip(airport.lonx)}.`,
      };

  return {
    airport,
    renamedAirport: null,
    icaoStatus,
    coordinateStatus,
  };
};

const createMsfsValidationSection = (
  icao: string,
  coordinates: { latitude: number; longitude: number },
): HTMLDivElement => {
  const validation = getMsfsValidation(icao, coordinates);
  const hasWarning = !validation.icaoStatus.ok || !validation.coordinateStatus.ok;
  const section = createSectionCard('MSFS 2020 validation', hasWarning);

  const items = document.createElement('div');
  items.style.display = 'flex';
  items.style.flexDirection = 'column';
  items.style.gap = '8px';
  items.append(
    createStatusItem(
      validation.icaoStatus.ok ? `${icao} exists in MSFS 2020` : `${icao} does not exist in MSFS 2020`,
      validation.icaoStatus,
    ),
  );
  items.append(
    createStatusItem(
      validation.coordinateStatus.ok ? 'Position matches to 2 decimals' : 'Position does not match MSFS 2020',
      validation.coordinateStatus,
    ),
  );
  if (validation.renamedAirport) {
    items.append(createInfoItem(`MSFS 2020 uses ICAO ${validation.renamedAirport.ident} for this airport`));
  }
  section.append(items);

  return section;
};

const findAirportRoot = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('#mainContentDiv > div.row.clearfix');

const findAirportHelpersAnchor = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('#mainContentDiv > div.row.clearfix > div.col-md-5');

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

  const airportHelpersAnchor = findAirportHelpersAnchor();
  if (!airportHelpersAnchor) {
    console.warn('FSE Tools: airport helpers anchor not found.');
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

  const sectionsRow = createSectionsRow();
  sectionsRow.append(createMsfsValidationSection(icao, coordinates));
  panel.append(sectionsRow);

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

  airportHelpersAnchor.insertAdjacentElement('afterend', panel);
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
    const airportHelpersAnchor = findAirportHelpersAnchor();
    const airportHeaderRoot = findAirportHeaderRoot();
    const coordinatesElement = airportRoot ? findCoordinatesElement(airportRoot) : null;
    const elevationElement = airportRoot ? findElevationElement(airportRoot) : null;
    const parsedCoordinates = coordinatesElement ? parseAirportCoordinates(getTextContent(coordinatesElement)) : null;
    const msfsValidation = icao.value && parsedCoordinates ? getMsfsValidation(icao.value, parsedCoordinates) : null;
    const nearestAirports = getNearestAirports();

    return {
      enhancerPanelInjected: !!document.getElementById(ENHANCER_ID),
      icao: icao.value,
      icaoSource: icao.source,
      queryIcao: url.searchParams.get('icao')?.trim().toUpperCase() ?? null,
      domIcao: getAirportIcaoFromDom(),
      airportRootFound: !!airportRoot,
      airportHelpersAnchorFound: !!airportHelpersAnchor,
      airportHeaderRootFound: !!airportHeaderRoot,
      coordinatesElementFound: !!coordinatesElement,
      coordinatesText: getTextContent(coordinatesElement),
      parsedCoordinates,
      elevationElementFound: !!elevationElement,
      msfsAirportFound: !!msfsValidation?.airport,
      msfsIcaoMatches: msfsValidation?.icaoStatus.ok ?? false,
      msfsCoordinatesMatch: msfsValidation?.coordinateStatus.ok ?? false,
      msfsRenamedIcao: msfsValidation?.renamedAirport?.ident ?? null,
      correctedIcao: icao.value ? (getCorrectedAirportForIcao(icao.value) ?? null) : null,
      hasAirportWithoutIcaoWarning: icao.value ? airportsWithoutIcao.includes(icao.value) : false,
      hasNonExistingAirportWarning: icao.value ? nonExistingAirports.includes(icao.value) : false,
      nearestAirports,
    };
  },
};
