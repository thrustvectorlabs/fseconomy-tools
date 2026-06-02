import { airportsWithoutIcao, nonExistingAirports } from '../data/airportMap';
import msfs2020Airports from '../data/msfs-2020-airports.json';
import { extractPayload } from '../utils/assignments';
import { areCoordinatesNear, getCoordinateDifference, parseAirportCoordinates } from '../utils/coordinates';
import { findFirstElementByText, getTextContent } from '../utils/dom';
import { extractTableCellValuesFromRow } from '../utils/extractTableCellValuesFromRow';
import { getCorrectedAirportForIcao } from '../utils/airport';
import { SiteEnhancerDefinition } from './types';

const ENHANCER_ID = 'fset-airport-enhancer';
const AIRPORT_PATHNAME = '/airport.jsp';
const MY_FLIGHT_PATHNAME = '/myflight.jsp';
const MSFS_COORDINATE_MATCH_TOLERANCE = 0.01;

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

type MapLinkAirportDetails = {
  icao: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type AirportAssignment = {
  assignmentId: number;
  assignmentType: 'T' | 'A' | 'V';
  destination: string;
  distance: number;
  pay: number;
  payload: number;
  payloadString: string;
  payloadUnit: 'pax' | 'kg';
  aircraftRegistration?: string;
  isPassengerTerminalAssignment: boolean;
};

type AirportAircraft = {
  registration: string;
  type: string;
  homeIcao: string;
  distanceBonus: number;
  rentalPriceDry: number | null;
  rentalPriceWet: number | null;
  isRentableDry: boolean;
  isRentableWet: boolean;
  needsRepair: boolean;
};

type DestinationSummary = {
  destination: string;
  assignmentCount: number;
  totalPay: number;
  totalPayload: number;
  payloadUnit: 'pax' | 'kg' | 'mixed';
  bestPayPerNm: number;
  distanceNm: number;
  passengerTerminalCount: number;
  aircraftSpecificCount: number;
  selectedAssignments: AirportAssignment[];
};

type DispatchFilters = {
  selectedAssignmentTypes: Array<'T' | 'V' | 'A'>;
  maxPassengerPayload: number | null;
  maxRangeNm: number | null;
  excludedDestinations: Set<string>;
};

type NearbyAirportDispatchResult = {
  icao: string;
  distanceNm: number | null;
  assignments: AirportAssignment[];
};

type NearbyAirportFetchOutcome = {
  validResults: NearbyAirportDispatchResult[];
  excludedAirports: string[];
};

const msfsAirportByIdent = new Map(
  (msfs2020Airports as Msfs2020Airport[]).map((airport) => [airport.ident.toUpperCase(), airport]),
);

const cleanCurrency = (value: string): string => value.replace(/[$,]/g, '').trim();

const parseCurrencyToNumber = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(cleanCurrency(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toInteger = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const getOptionalCell = (cells: string[], index: number): string | null =>
  index >= 0 && index < cells.length ? cells[index] : null;

const normalizeAssignmentType = (value: string | null | undefined): 'T' | 'A' | 'V' | null => {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  if (normalized.startsWith('ALL-IN') || normalized.startsWith('A')) return 'A';
  if (normalized.startsWith('VIP') || normalized.startsWith('V')) return 'V';
  if (normalized.startsWith('TRIP') || normalized.startsWith('T')) return 'T';
  return null;
};

const inferPayloadUnit = (assignmentType: 'T' | 'A' | 'V', description: string): 'pax' | 'kg' => {
  if (assignmentType === 'V' || assignmentType === 'A') {
    return 'pax';
  }

  return description.includes('Cargo') ? 'kg' : 'pax';
};

const getDistanceBonus = (cellText: string): number => {
  const match = cellText.match(/\$(\d[\d,]*)/);
  if (!match) {
    return 0;
  }

  const numeric = Number(match[1].replace(/,/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
};

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

const createSectionCard = (
  title: string,
  hasWarning: boolean,
  layout: { flex?: string; minWidth?: string } = {},
): HTMLDivElement => {
  const card = document.createElement('div');
  card.style.flex = layout.flex ?? '1 1 280px';
  card.style.minWidth = layout.minWidth ?? '280px';
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

const getValidationSummary = (validation: MsfsValidationResult): { icon: string; color: string; tooltip: string } => {
  const tooltipLines = [
    validation.icaoStatus.ok
      ? `${validation.airport?.ident ?? 'ICAO'} exists in MSFS 2020`
      : validation.icaoStatus.message,
    validation.coordinateStatus.ok
      ? 'Position matches MSFS 2020 to 2 decimals'
      : validation.coordinateStatus.message,
  ];

  if (validation.renamedAirport) {
    tooltipLines.push(`MSFS 2020 uses ICAO ${validation.renamedAirport.ident} for this airport.`);
  }

  const hasWarning = !validation.icaoStatus.ok || !validation.coordinateStatus.ok;
  return {
    icon: hasWarning ? '⚠' : '✓',
    color: hasWarning ? '#c2410c' : '#2e7d32',
    tooltip: tooltipLines.join('\n'),
  };
};

const hasValidationWarning = (validation: MsfsValidationResult): boolean =>
  !validation.icaoStatus.ok || !validation.coordinateStatus.ok;

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

const createWarningItem = (message: string): HTMLDivElement => {
  const item = document.createElement('div');
  item.textContent = message;
  item.style.padding = '8px 10px';
  item.style.borderRadius = '4px';
  item.style.backgroundColor = 'rgba(255, 237, 213, 0.8)';
  item.style.color = '#9a3412';
  item.style.fontWeight = '600';
  return item;
};

const createEmptyState = (message: string): HTMLDivElement => {
  const item = document.createElement('div');
  item.textContent = message;
  item.style.padding = '8px 10px';
  item.style.borderRadius = '4px';
  item.style.backgroundColor = '#f8fafc';
  item.style.color = '#475569';
  return item;
};

const createMetricGrid = (): HTMLDivElement => {
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
  grid.style.gap = '8px';
  return grid;
};

const createMetricCard = (label: string, value: string): HTMLDivElement => {
  const card = document.createElement('div');
  card.style.padding = '10px';
  card.style.border = '1px solid #e2e8f0';
  card.style.borderRadius = '6px';
  card.style.backgroundColor = '#fff';

  const labelElement = document.createElement('div');
  labelElement.textContent = label;
  labelElement.style.fontSize = '12px';
  labelElement.style.textTransform = 'uppercase';
  labelElement.style.letterSpacing = '0.04em';
  labelElement.style.color = '#64748b';
  labelElement.style.marginBottom = '4px';
  card.append(labelElement);

  const valueElement = document.createElement('div');
  valueElement.textContent = value;
  valueElement.style.fontSize = '20px';
  valueElement.style.fontWeight = '700';
  valueElement.style.color = '#0f172a';
  card.append(valueElement);

  return card;
};

const createFormRow = (): HTMLDivElement => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.flexWrap = 'wrap';
  row.style.gap = '10px';
  row.style.marginTop = '10px';
  return row;
};

const createFieldGroup = (label: string, control: HTMLElement): HTMLLabelElement => {
  const group = document.createElement('label');
  group.style.display = 'flex';
  group.style.flexDirection = 'column';
  group.style.gap = '4px';
  group.style.fontSize = '12px';
  group.style.fontWeight = '700';
  group.style.color = '#334155';
  group.textContent = label;
  group.append(control);
  return group;
};

const createNumberInputControl = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.step = '1';
  input.placeholder = 'Any';
  input.style.width = '120px';
  input.style.padding = '6px 8px';
  input.style.border = '1px solid #cbd5e1';
  input.style.borderRadius = '4px';
  input.style.backgroundColor = '#fff';
  input.style.color = '#0f172a';
  return input;
};

const createCheckboxGroup = (): HTMLDivElement => {
  const group = document.createElement('div');
  group.style.display = 'flex';
  group.style.flexWrap = 'wrap';
  group.style.gap = '8px';
  return group;
};

const createCheckboxChip = (
  label: string,
  checked: boolean,
): { wrapper: HTMLLabelElement; input: HTMLInputElement } => {
  const wrapper = document.createElement('label');
  wrapper.style.display = 'inline-flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '6px';
  wrapper.style.padding = '6px 8px';
  wrapper.style.border = '1px solid #cbd5e1';
  wrapper.style.borderRadius = '999px';
  wrapper.style.backgroundColor = '#fff';
  wrapper.style.color = '#0f172a';
  wrapper.style.fontWeight = '600';
  wrapper.style.cursor = 'pointer';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = checked;
  wrapper.append(input, document.createTextNode(label));

  return { wrapper, input };
};

const createList = (): HTMLDivElement => {
  const list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '8px';
  return list;
};

const createAirportHref = (icao: string): string => `${AIRPORT_PATHNAME}?icao=${encodeURIComponent(icao)}`;

const createAirportLink = (icao: string): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.href = createAirportHref(icao);
  link.textContent = icao;
  return link;
};

const createSummaryRow = (
  title: string,
  details: string | Node,
  href?: string,
  action?: {
    label: string;
    onClick: () => void;
  },
): HTMLDivElement => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'stretch';
  row.style.justifyContent = 'space-between';
  row.style.gap = '12px';
  row.style.padding = '10px';
  row.style.border = '1px solid #e2e8f0';
  row.style.borderRadius = '6px';
  row.style.backgroundColor = '#fff';
  row.style.minHeight = '84px';

  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.flex = '1 1 auto';
  content.style.minWidth = '0';
  content.style.justifyContent = 'flex-start';

  const titleElement = href ? document.createElement('a') : document.createElement('div');
  if (href && titleElement instanceof HTMLAnchorElement) {
    titleElement.href = href;
    titleElement.textContent = title;
  } else {
    titleElement.textContent = title;
  }
  titleElement.style.display = 'block';
  titleElement.style.fontWeight = '700';
  titleElement.style.color = '#0f172a';
  content.append(titleElement);

  const detailsElement = document.createElement('div');
  if (typeof details === 'string') {
    detailsElement.textContent = details;
  } else {
    detailsElement.append(details);
  }
  detailsElement.style.marginTop = '4px';
  detailsElement.style.color = '#475569';
  detailsElement.style.fontSize = '13px';
  content.append(detailsElement);

  row.append(content);

  if (action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action.label;
    button.style.alignSelf = 'center';
    button.style.flex = '0 0 auto';
    button.style.whiteSpace = 'nowrap';
    button.style.cursor = 'pointer';
    button.style.border = '1px solid #bec8d2';
    button.style.backgroundColor = '#fff';
    button.style.borderRadius = '4px';
    button.style.padding = '6px 10px';
    button.addEventListener('click', action.onClick);
    row.append(button);
  }

  return row;
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const formatSelectedPayload = (assignments: AirportAssignment[]): string => {
  const passengerPayload = assignments
    .filter((assignment) => assignment.payloadUnit === 'pax')
    .reduce((sum, assignment) => sum + assignment.payload, 0);
  const cargoPayload = assignments
    .filter((assignment) => assignment.payloadUnit === 'kg')
    .reduce((sum, assignment) => sum + assignment.payload, 0);

  if (passengerPayload > 0 && cargoPayload > 0) {
    return `${passengerPayload} pax + ${cargoPayload} kg`;
  }
  if (passengerPayload > 0) {
    return `${passengerPayload} pax`;
  }
  return `${cargoPayload} kg`;
};

const createDispatchSummaryDetails = (
  destination: string,
  summaryText: string,
): DocumentFragment => {
  const details = document.createDocumentFragment();
  details.append(createAirportLink(destination), ` • ${summaryText}`);
  return details;
};

const createLinkRow = (label: string, href: string): HTMLDivElement => {
  const row = createRow();
  const link = document.createElement('a');
  link.href = href;
  link.textContent = label;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.style.display = 'inline-flex';
  link.style.alignItems = 'center';
  link.style.justifyContent = 'center';
  link.style.cursor = 'pointer';
  link.style.border = '1px solid #bec8d2';
  link.style.backgroundColor = '#fff';
  link.style.borderRadius = '4px';
  link.style.padding = '8px 12px';
  link.style.color = '#0f172a';
  link.style.fontWeight = '600';
  link.style.textDecoration = 'none';
  link.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.06)';
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
  button.style.padding = '8px 12px';
  button.style.color = '#0f172a';
  button.style.fontWeight = '600';
  button.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.06)';
  button.addEventListener('click', onClick);
  row.append(button);
  return row;
};

const createButton = (label: string, onClick: () => void): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.style.cursor = 'pointer';
  button.style.border = '1px solid #bec8d2';
  button.style.backgroundColor = '#fff';
  button.style.borderRadius = '4px';
  button.style.padding = '8px 12px';
  button.style.color = '#0f172a';
  button.style.fontWeight = '600';
  button.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.06)';
  button.addEventListener('click', onClick);
  return button;
};

const createActionButtonsRow = (): HTMLDivElement => {
  const row = createRow();
  row.style.justifyContent = 'flex-end';
  row.style.marginTop = '2px';
  return row;
};

const createMessageRow = (message: string): HTMLDivElement => {
  const row = createRow();
  row.textContent = message;
  return row;
};

const formatCoordinateForTooltip = (value: number): string => value.toFixed(3);

const findRenamedMsfsAirport = (coordinates: { latitude: number; longitude: number }): Msfs2020Airport | null => {
  const matches = (msfs2020Airports as Msfs2020Airport[]).filter(
    (airport) =>
      areCoordinatesNear(
        coordinates,
        { latitude: airport.laty, longitude: airport.lonx },
        MSFS_COORDINATE_MATCH_TOLERANCE,
      ),
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

  const msfsCoordinates = { latitude: airport.laty, longitude: airport.lonx };
  const difference = getCoordinateDifference(coordinates, msfsCoordinates);
  const coordinatesMatch = areCoordinatesNear(coordinates, msfsCoordinates, MSFS_COORDINATE_MATCH_TOLERANCE);

  const coordinateStatus: ValidationStatus = coordinatesMatch
    ? { ok: true }
    : {
        ok: false,
        message: `FSE ${formatCoordinateForTooltip(coordinates.latitude)}, ${formatCoordinateForTooltip(coordinates.longitude)} vs MSFS ${formatCoordinateForTooltip(airport.laty)}, ${formatCoordinateForTooltip(airport.lonx)} (delta lat ${difference.latitude.toFixed(3)}, lon ${difference.longitude.toFixed(3)}).`,
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
  const section = createSectionCard('MSFS 2020 validation', hasWarning, { flex: '1 1 32%', minWidth: '260px' });

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

const findAirportRootInDocument = (root: ParentNode): HTMLElement | null =>
  root.querySelector<HTMLElement>('#mainContentDiv > div.row.clearfix');

const findAirportHelpersAnchor = (): HTMLElement | null =>
  document.querySelector<HTMLElement>('#mainContentDiv > div.row.clearfix > div.col-md-5');

const findAirportInfoColumn = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(
    '#mainContentDiv > div.row.clearfix > div.col-md-5 > div > div > div:nth-child(1) > div:nth-child(2)',
  );

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

const parseMapLinkAirportDetails = (mapLink: HTMLAnchorElement): MapLinkAirportDetails | null => {
  const onclick = mapLink.getAttribute('onclick') ?? '';
  const match = onclick.match(
    /showAssignmentMap\(\s*event,\s*'[^']*',\s*'[^']*',\s*'([^']+)',\s*'([^']+)',\s*'[^']*',\s*'([^']+)'\s*\)/i,
  );
  if (!match) {
    return null;
  }

  const latitude = Number.parseFloat(match[1]);
  const longitude = Number.parseFloat(match[2]);
  const icao = match[3]?.trim().toUpperCase();

  if (!icao || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    icao,
    coordinates: {
      latitude,
      longitude,
    },
  };
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

const createValidationIndicator = (summary: { icon: string; color: string; tooltip: string }, className: string): HTMLSpanElement => {
  const icon = document.createElement('span');
  icon.className = className;
  icon.textContent = summary.icon;
  icon.title = summary.tooltip;
  icon.style.display = 'inline-block';
  icon.style.marginLeft = '6px';
  icon.style.color = summary.color;
  icon.style.fontSize = '14px';
  icon.style.fontWeight = '700';
  icon.style.cursor = 'help';
  icon.setAttribute('aria-label', summary.tooltip);
  return icon;
};

const enhanceJobTableDestinationValidation = (): void => {
  const destinationRows = Array.from(document.querySelectorAll<HTMLTableRowElement>('#jobTable > tbody > tr'));

  destinationRows.forEach((row) => {
    const destinationCell = row.querySelectorAll<HTMLTableCellElement>('td')[3];
    if (!destinationCell || destinationCell.querySelector('.fset-destination-validation')) {
      return;
    }

    const destinationLinks = Array.from(destinationCell.querySelectorAll<HTMLAnchorElement>('a'));
    const mapLink = destinationLinks.find((link) => (link.getAttribute('onclick') ?? '').includes('showAssignmentMap('));
    const airportLink = destinationLinks.find((link) => /airport\.jsp\?icao=/i.test(link.getAttribute('href') ?? ''));

    if (!mapLink || !airportLink) {
      return;
    }

    const airportDetails = parseMapLinkAirportDetails(mapLink);
    if (!airportDetails) {
      return;
    }

    const validation = getMsfsValidation(airportDetails.icao, airportDetails.coordinates);
    const summary = getValidationSummary(validation);
    const icon = createValidationIndicator(summary, 'fset-destination-validation');
    airportLink.insertAdjacentElement('afterend', icon);
  });
};

const getRemoteAirportValidationSummary = async (
  icao: string,
): Promise<{ summary: { icon: string; color: string; tooltip: string }; hasWarning: boolean } | null> => {
  const response = await fetch(`/airport.jsp?icao=${encodeURIComponent(icao)}`);
  const html = await response.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const airportRoot = findAirportRootInDocument(dom);
  const coordinatesElement = airportRoot ? findCoordinatesElement(airportRoot) : null;
  const coordinates = coordinatesElement ? parseAirportCoordinates(getTextContent(coordinatesElement)) : null;

  if (!coordinates) {
    return null;
  }

  const validation = getMsfsValidation(icao, coordinates);
  return {
    summary: getValidationSummary(validation),
    hasWarning: hasValidationWarning(validation),
  };
};

const enhanceCloseAirportsValidation = (): void => {
  const table = Array.from(document.querySelectorAll<HTMLTableElement>('table')).find((candidate) =>
    getTextContent(candidate.querySelector('th')).includes('Close Airports'),
  );
  if (!table) {
    return;
  }

  const closeAirportRows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'));
  closeAirportRows.forEach((row) => {
    const cells = row.querySelectorAll<HTMLTableCellElement>('td');
    const airportCell = cells[0];
    const distanceCell = cells[1];
    const directionCell = cells[2];

    if (airportCell) {
      airportCell.style.width = '42%';
    }

    if (distanceCell) {
      distanceCell.style.width = '29%';
    }

    if (directionCell) {
      directionCell.style.width = '29%';
    }
  });

  closeAirportRows.forEach((row) => {
    const airportCell = row.querySelectorAll<HTMLTableCellElement>('td')[0];
    if (!airportCell || airportCell.querySelector('.fset-close-airport-validation')) {
      return;
    }

    const airportLinks = Array.from(airportCell.querySelectorAll<HTMLAnchorElement>('a'));
    const airportLink = airportLinks.find((link) => /airport\.jsp\?icao=/i.test(link.getAttribute('href') ?? ''));
    if (!airportLink) {
      return;
    }

    const mapLink = airportLinks.find((link) => (link.getAttribute('onclick') ?? '').includes('showAssignmentMap('));
    const airportDetails = mapLink ? parseMapLinkAirportDetails(mapLink) : null;

    if (airportDetails) {
      const validation = getMsfsValidation(airportDetails.icao, airportDetails.coordinates);
      const summary = getValidationSummary(validation);
      airportLink.insertAdjacentElement(
        'afterend',
        createValidationIndicator(summary, 'fset-close-airport-validation'),
      );
      return;
    }

    void getRemoteAirportValidationSummary(getTextContent(airportLink))
      .then((result) => {
        if (!result || airportCell.querySelector('.fset-close-airport-validation')) {
          return;
        }

        airportLink.insertAdjacentElement(
          'afterend',
          createValidationIndicator(result.summary, 'fset-close-airport-validation'),
        );
      })
      .catch(() => {
        // Ignore per-row lookup failures to avoid interrupting the airport page.
      });
  });
};

const getDestinationValidationWarnings = (): Set<string> => {
  const destinationsWithWarnings = new Set<string>();
  const destinationRows = Array.from(document.querySelectorAll<HTMLTableRowElement>('#jobTable > tbody > tr'));

  destinationRows.forEach((row) => {
    const destinationCell = row.querySelectorAll<HTMLTableCellElement>('td')[3];
    if (!destinationCell) {
      return;
    }

    const destinationLinks = Array.from(destinationCell.querySelectorAll<HTMLAnchorElement>('a'));
    const mapLink = destinationLinks.find((link) => (link.getAttribute('onclick') ?? '').includes('showAssignmentMap('));
    if (!mapLink) {
      return;
    }

    const airportDetails = parseMapLinkAirportDetails(mapLink);
    if (!airportDetails) {
      return;
    }

    const validation = getMsfsValidation(airportDetails.icao, airportDetails.coordinates);
    if (hasValidationWarning(validation)) {
      destinationsWithWarnings.add(airportDetails.icao);
    }
  });

  return destinationsWithWarnings;
};

const getAirportAssignmentsFromRoot = (root: ParentNode): AirportAssignment[] => {
  const assignmentRows = Array.from(root.querySelectorAll<HTMLElement>('#jobTable > tbody > tr'));
  return assignmentRows
    .map((row): AirportAssignment | null => {
      const cells = extractTableCellValuesFromRow(row);
      const payText = getOptionalCell(cells, 1);
      const destination = getOptionalCell(cells, 3)?.trim();
      const distanceText = getOptionalCell(cells, 4);
      const payloadText = getOptionalCell(cells, 6)?.trim() ?? '';
      const typeCell = getOptionalCell(cells, 7) ?? '';
      const aircraftText = getOptionalCell(cells, 8)?.trim();
      const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]');

      const assignmentType = normalizeAssignmentType(typeCell);
      const pay = parseCurrencyToNumber(payText);
      const distance = toInteger(distanceText);

      if (!checkbox?.value || !assignmentType || !destination || pay == null || distance == null) {
        return null;
      }

      return {
        assignmentId: Number.parseInt(checkbox.value, 10),
        assignmentType,
        destination,
        distance,
        pay,
        payload: extractPayload(payloadText, assignmentType),
        payloadString: payloadText,
        payloadUnit: inferPayloadUnit(assignmentType, payloadText),
        aircraftRegistration: aircraftText && aircraftText !== '[N/A]' ? aircraftText : undefined,
        isPassengerTerminalAssignment: row.querySelectorAll('td')[6]?.querySelector('font[color="Green"]') != null,
      };
    })
    .filter((assignment): assignment is AirportAssignment => assignment !== null);
};

const getAirportAssignments = (): AirportAssignment[] => getAirportAssignmentsFromRoot(document);

const fetchAssignmentsForAirport = async (
  icao: string,
): Promise<{ assignments: AirportAssignment[]; hasMsfsValidationIssue: boolean }> => {
  const response = await fetch(`/airport.jsp?icao=${encodeURIComponent(icao)}`);
  const html = await response.text();
  const dom = new DOMParser().parseFromString(html, 'text/html');
  const airportRoot = findAirportRootInDocument(dom);
  const coordinatesElement = airportRoot ? findCoordinatesElement(airportRoot) : null;
  const coordinates = coordinatesElement ? parseAirportCoordinates(getTextContent(coordinatesElement)) : null;
  const hasMsfsValidationIssue = coordinates ? hasValidationWarning(getMsfsValidation(icao, coordinates)) : true;

  return {
    assignments: getAirportAssignmentsFromRoot(dom),
    hasMsfsValidationIssue,
  };
};

const fetchNearbyAirportAssignments = async (
  nearestAirports: Array<{ icao: string; distanceNm: number | null }>,
): Promise<NearbyAirportFetchOutcome> => {
  const fetchedAirports = await Promise.all(
    nearestAirports.map(async (airport) => ({
      icao: airport.icao,
      distanceNm: airport.distanceNm,
      ...(await fetchAssignmentsForAirport(airport.icao)),
    })),
  );

  return fetchedAirports.reduce<NearbyAirportFetchOutcome>(
    (outcome, airport) => {
      if (airport.hasMsfsValidationIssue) {
        outcome.excludedAirports.push(airport.icao);
        return outcome;
      }

      outcome.validResults.push({
        icao: airport.icao,
        distanceNm: airport.distanceNm,
        assignments: airport.assignments,
      });
      return outcome;
    },
    { validResults: [], excludedAirports: [] },
  );
};

const getAirportAssignmentForm = (): HTMLFormElement | null => {
  const firstAssignmentCheckbox = document.querySelector<HTMLInputElement>('#jobTable input[type="checkbox"][name="select"]');
  if (firstAssignmentCheckbox?.form) {
    return firstAssignmentCheckbox.form;
  }

  return document.querySelector<HTMLFormElement>('#jobTable form') ?? document.querySelector<HTMLFormElement>('form');
};

const submitAssignmentsToMyFlight = (assignmentIds: number[]): void => {
  if (assignmentIds.length === 0) {
    window.alert('No assignments were selected for My Flight.');
    return;
  }

  const assignmentForm = getAirportAssignmentForm();
  if (!assignmentForm) {
    window.alert('Could not find the airport assignment form.');
    return;
  }

  const assignmentIdSet = new Set(assignmentIds.map(String));
  const visibleAssignmentIds = new Set(
    Array.from(document.querySelectorAll<HTMLInputElement>('#jobTable input[type="checkbox"][name="select"]')).map(
      (checkbox) => checkbox.value,
    ),
  );
  const missingAssignments = [...assignmentIdSet].filter((assignmentId) => !visibleAssignmentIds.has(assignmentId));
  if (missingAssignments.length > 0) {
    window.alert('One or more recommended assignments are no longer visible on this page.');
    return;
  }

  const submissionForm = document.createElement('form');
  submissionForm.method = (assignmentForm.method || 'post').toLowerCase();
  submissionForm.action = assignmentForm.action || '/userctl';
  submissionForm.style.display = 'none';

  const sourceData = new FormData(assignmentForm);
  sourceData.delete('select');
  sourceData.set('returnpage', MY_FLIGHT_PATHNAME);

  sourceData.forEach((value, key) => {
    if (typeof value !== 'string') {
      return;
    }

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    submissionForm.append(input);
  });

  assignmentIds.forEach((assignmentId) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'select';
    input.value = String(assignmentId);
    submissionForm.append(input);
  });

  document.body.append(submissionForm);
  submissionForm.submit();
};

const extractRentalPriceFromElement = (priceCell: Element, priceType: 'Dry' | 'Wet'): number | null => {
  const priceLink = Array.from(priceCell.querySelectorAll('a.btn.btn-xs.btn-success')).find((link) =>
    link.textContent?.includes(priceType),
  );
  if (!priceLink || !priceLink.textContent) {
    return null;
  }

  const cleaned = priceLink.textContent.replace('[Hour]', '').replace(priceType, '').trim();
  return parseCurrencyToNumber(cleaned);
};

const getAirportAircraft = (): AirportAircraft[] => {
  const aircraftRows = Array.from(document.querySelectorAll<HTMLElement>('#acTable > tbody > tr'));

  return aircraftRows
    .map((row): AirportAircraft | null => {
      const cells = extractTableCellValuesFromRow(row);
      const registration = getOptionalCell(cells, 0)?.replace('*', '').trim();
      const type = getOptionalCell(cells, 1)?.trim();
      const homeIcao =
        row
          .querySelectorAll('td')[3]
          ?.querySelector<HTMLAnchorElement>('a[href*="airport.jsp?icao="]')
          ?.textContent?.trim() ?? getOptionalCell(cells, 3)?.trim();
      const bonusCell = getOptionalCell(cells, 4) ?? '';
      const priceCell = row.querySelectorAll('td')[5];
      const rentalPriceDry = priceCell ? extractRentalPriceFromElement(priceCell, 'Dry') : null;
      const rentalPriceWet = priceCell ? extractRentalPriceFromElement(priceCell, 'Wet') : null;

      if (!registration || !type || !homeIcao) {
        return null;
      }

      return {
        registration,
        type,
        homeIcao,
        distanceBonus: getDistanceBonus(bonusCell),
        rentalPriceDry,
        rentalPriceWet,
        isRentableDry: rentalPriceDry != null,
        isRentableWet: rentalPriceWet != null,
        needsRepair: row.querySelector('td i.fa-wrench, td img[src="img/repair.gif"], td img[src*="repair"]') != null,
      };
    })
    .filter((aircraft): aircraft is AirportAircraft => aircraft !== null);
};

const getPayPerNm = (summary: Pick<DestinationSummary, 'distanceNm' | 'totalPay'>): number =>
  summary.distanceNm > 0 ? summary.totalPay / summary.distanceNm : 0;

const getBestCombinablePassengerAssignments = (
  assignments: AirportAssignment[],
  maxPassengerPayload: number | null,
): AirportAssignment[] => {
  if (assignments.length === 0) {
    return [];
  }

  const capacity =
    maxPassengerPayload ?? assignments.reduce((sum, assignment) => sum + Math.max(assignment.payload, 0), 0);

  if (capacity <= 0) {
    return [];
  }

  const bestByPayload = new Map<number, AirportAssignment[]>();
  const payByPayload = new Map<number, number>();
  bestByPayload.set(0, []);
  payByPayload.set(0, 0);

  assignments.forEach((assignment) => {
    if (assignment.payload <= 0 || assignment.payload > capacity) {
      return;
    }

    const currentEntries = Array.from(bestByPayload.entries()).sort((left, right) => right[0] - left[0]);
    currentEntries.forEach(([usedPayload, chosenAssignments]) => {
      const nextPayload = usedPayload + assignment.payload;
      if (nextPayload > capacity) {
        return;
      }

      const nextPay = (payByPayload.get(usedPayload) ?? 0) + assignment.pay;
      const previousPay = payByPayload.get(nextPayload) ?? Number.NEGATIVE_INFINITY;
      if (nextPay > previousPay) {
        bestByPayload.set(nextPayload, [...chosenAssignments, assignment]);
        payByPayload.set(nextPayload, nextPay);
      }
    });
  });

  let bestAssignments: AirportAssignment[] = [];
  let bestPay = Number.NEGATIVE_INFINITY;
  let bestPayload = 0;

  bestByPayload.forEach((chosenAssignments, payload) => {
    const totalPay = payByPayload.get(payload) ?? Number.NEGATIVE_INFINITY;
    if (totalPay > bestPay || (totalPay === bestPay && payload > bestPayload)) {
      bestAssignments = chosenAssignments;
      bestPay = totalPay;
      bestPayload = payload;
    }
  });

  return bestAssignments;
};

const getDestinationSummary = (
  destination: string,
  assignments: AirportAssignment[],
  filters: DispatchFilters,
): DestinationSummary | null => {
  const selectedTypes = new Set(filters.selectedAssignmentTypes);
  const matchingAssignments = assignments.filter((assignment) => selectedTypes.has(assignment.assignmentType));
  if (matchingAssignments.length === 0) {
    return null;
  }

  const cargoAssignments = matchingAssignments.filter((assignment) => assignment.payloadUnit === 'kg');
  const combinablePassengerAssignments = matchingAssignments.filter(
    (assignment) => assignment.payloadUnit === 'pax' && assignment.assignmentType === 'T',
  );
  const exclusivePassengerAssignments = matchingAssignments.filter(
    (assignment) => assignment.payloadUnit === 'pax' && assignment.assignmentType !== 'T',
  );

  const bestCombinablePassengerAssignments = getBestCombinablePassengerAssignments(
    combinablePassengerAssignments,
    filters.maxPassengerPayload,
  );

  const combinableScenarioAssignments = [...cargoAssignments, ...bestCombinablePassengerAssignments];
  const combinableScenarioPay = combinableScenarioAssignments.reduce((sum, assignment) => sum + assignment.pay, 0);

  const bestExclusiveAssignment =
    exclusivePassengerAssignments
      .filter((assignment) => filters.maxPassengerPayload == null || assignment.payload <= filters.maxPassengerPayload)
      .sort((left, right) => right.pay - left.pay)[0] ?? null;

  const selectedAssignments =
    bestExclusiveAssignment && bestExclusiveAssignment.pay > combinableScenarioPay
      ? [bestExclusiveAssignment]
      : combinableScenarioAssignments;

  if (selectedAssignments.length === 0) {
    return null;
  }

  const payloadUnits = new Set(selectedAssignments.map((assignment) => assignment.payloadUnit));
  const totalPay = selectedAssignments.reduce((sum, assignment) => sum + assignment.pay, 0);
  const totalPayload = selectedAssignments.reduce((sum, assignment) => sum + assignment.payload, 0);

  return {
    destination,
    assignmentCount: selectedAssignments.length,
    totalPay,
    totalPayload,
    payloadUnit: payloadUnits.size > 1 ? 'mixed' : (selectedAssignments[0]?.payloadUnit ?? 'pax'),
    distanceNm: selectedAssignments[0]?.distance ?? matchingAssignments[0]?.distance ?? 0,
    bestPayPerNm:
      (selectedAssignments[0]?.distance ?? matchingAssignments[0]?.distance ?? 0) > 0
        ? totalPay / (selectedAssignments[0]?.distance ?? matchingAssignments[0]?.distance ?? 1)
        : 0,
    passengerTerminalCount: selectedAssignments.filter((assignment) => assignment.isPassengerTerminalAssignment).length,
    aircraftSpecificCount: selectedAssignments.filter((assignment) => assignment.aircraftRegistration).length,
    selectedAssignments,
  };
};

const getFilteredAssignments = (assignments: AirportAssignment[], filters: DispatchFilters): AirportAssignment[] => {
  const selectedTypes = new Set(filters.selectedAssignmentTypes);
  return assignments.filter((assignment) => {
    if (!selectedTypes.has(assignment.assignmentType)) {
      return false;
    }

    if (filters.excludedDestinations.has(assignment.destination)) {
      return false;
    }

    if (filters.maxRangeNm != null && assignment.distance > filters.maxRangeNm) {
      return false;
    }

    if (
      filters.maxPassengerPayload != null &&
      assignment.payloadUnit === 'pax' &&
      assignment.assignmentType !== 'T' &&
      assignment.payload > filters.maxPassengerPayload
    ) {
      return false;
    }

    return true;
  });
};

const getDestinationSummaries = (assignments: AirportAssignment[], filters: DispatchFilters): DestinationSummary[] => {
  const assignmentsByDestination = new Map<string, AirportAssignment[]>();

  assignments.forEach((assignment) => {
    const destinationAssignments = assignmentsByDestination.get(assignment.destination) ?? [];
    destinationAssignments.push(assignment);
    assignmentsByDestination.set(assignment.destination, destinationAssignments);
  });

  return Array.from(assignmentsByDestination.entries())
    .map(([destination, destinationAssignments]) => getDestinationSummary(destination, destinationAssignments, filters))
    .filter((summary): summary is DestinationSummary => summary !== null);
};

const getTopDestinationSummary = (
  destinationSummaries: DestinationSummary[],
  rankingMode: 'totalPay' | 'payPerNm',
): DestinationSummary | null =>
  [...destinationSummaries].sort((left, right) => {
    const primaryDifference =
      rankingMode === 'payPerNm' ? getPayPerNm(right) - getPayPerNm(left) : right.totalPay - left.totalPay;

    if (primaryDifference !== 0) {
      return primaryDifference;
    }

    return rankingMode === 'payPerNm' ? right.totalPay - left.totalPay : getPayPerNm(right) - getPayPerNm(left);
  })[0] ?? null;

const createDispatchSummarySection = (
  assignments: AirportAssignment[],
  aircraft: AirportAircraft[],
  nearestAirports: Array<{ icao: string; distanceNm: number | null }>,
): HTMLDivElement => {
  const readyAircraft = aircraft.filter(
    (candidate) => !candidate.needsRepair && (candidate.isRentableDry || candidate.isRentableWet),
  );
  const filters: DispatchFilters = {
    selectedAssignmentTypes: ['T', 'V', 'A'],
    maxPassengerPayload: null,
    maxRangeNm: null,
    excludedDestinations: getDestinationValidationWarnings(),
  };
  const section = createSectionCard('Dispatch summary', readyAircraft.length === 0 || assignments.length === 0, {
    flex: '2 1 64%',
    minWidth: '420px',
  });
  const controlsRow = createFormRow();
  const assignmentTypeCheckboxes = createCheckboxGroup();
  const tCheckbox = createCheckboxChip('T', true);
  const vCheckbox = createCheckboxChip('V', true);
  const aCheckbox = createCheckboxChip('A', true);
  assignmentTypeCheckboxes.append(tCheckbox.wrapper, vCheckbox.wrapper, aCheckbox.wrapper);
  controlsRow.append(createFieldGroup('Job types', assignmentTypeCheckboxes));

  const maxPassengerPayloadInput = createNumberInputControl();
  controlsRow.append(createFieldGroup('Max pax', maxPassengerPayloadInput));
  const maxRangeInput = createNumberInputControl();
  controlsRow.append(createFieldGroup('Max range', maxRangeInput));
  section.append(controlsRow);

  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.gap = '10px';
  content.style.marginTop = '10px';
  section.append(content);

  let nearbyAirportResults: NearbyAirportDispatchResult[] = [];
  let isLoadingNearbyAirports = false;
  let nearbyAirportsError: string | null = null;
  let excludedNearbyAirports: string[] = [];

  const nearbyControlsRow = createFormRow();
  nearbyControlsRow.style.marginTop = '0';
  const nearbyAirportsButton = createButton('Fetch nearby airport jobs', () => {
    if (isLoadingNearbyAirports || nearestAirports.length === 0) {
      return;
    }

    isLoadingNearbyAirports = true;
    nearbyAirportsError = null;
    excludedNearbyAirports = [];
    render();

    void fetchNearbyAirportAssignments(nearestAirports)
      .then((outcome) => {
        nearbyAirportResults = outcome.validResults;
        excludedNearbyAirports = outcome.excludedAirports;
      })
      .catch((error: unknown) => {
        nearbyAirportsError = error instanceof Error ? error.message : 'Unable to fetch nearby airport jobs.';
      })
      .finally(() => {
        isLoadingNearbyAirports = false;
        render();
      });
  });
  nearbyControlsRow.append(nearbyAirportsButton);
  section.append(nearbyControlsRow);

  const render = () => {
    const filteredAssignments = getFilteredAssignments(assignments, filters);
    const destinationSummaries = getDestinationSummaries(filteredAssignments, filters);
    const bestTotalPayJob = getTopDestinationSummary(destinationSummaries, 'totalPay');
    const bestPayPerMileJob = getTopDestinationSummary(destinationSummaries, 'payPerNm');
    const metrics = createMetricGrid();
    metrics.append(
      createMetricCard(
        'Jobs',
        String(destinationSummaries.reduce((sum, summary) => sum + summary.selectedAssignments.length, 0)),
      ),
      createMetricCard('Destinations', String(destinationSummaries.length)),
      createMetricCard('Ready rentals', String(readyAircraft.length)),
      createMetricCard('Needs repair', String(aircraft.filter((candidate) => candidate.needsRepair).length)),
    );

    const notes = createList();
    if (bestTotalPayJob) {
      notes.append(
        createSummaryRow(
          'Best total pay job',
          createDispatchSummaryDetails(
            bestTotalPayJob.destination,
            `${formatCurrency(bestTotalPayJob.totalPay)} • ${bestTotalPayJob.distanceNm} NM • ${formatSelectedPayload(bestTotalPayJob.selectedAssignments)} • ${bestTotalPayJob.assignmentCount} job${bestTotalPayJob.assignmentCount === 1 ? '' : 's'}`,
          ),
          undefined,
          {
            label: 'Load to My Flight',
            onClick: () =>
              submitAssignmentsToMyFlight(bestTotalPayJob.selectedAssignments.map((assignment) => assignment.assignmentId)),
          },
        ),
      );
    }
    if (bestPayPerMileJob) {
      notes.append(
        createSummaryRow(
          'Best pay per mile job',
          createDispatchSummaryDetails(
            bestPayPerMileJob.destination,
            `${formatCurrency(getPayPerNm(bestPayPerMileJob))}/NM • ${formatCurrency(bestPayPerMileJob.totalPay)} • ${bestPayPerMileJob.distanceNm} NM • ${formatSelectedPayload(bestPayPerMileJob.selectedAssignments)} • ${bestPayPerMileJob.assignmentCount} job${bestPayPerMileJob.assignmentCount === 1 ? '' : 's'}`,
          ),
          undefined,
          {
            label: 'Load to My Flight',
            onClick: () =>
              submitAssignmentsToMyFlight(bestPayPerMileJob.selectedAssignments.map((assignment) => assignment.assignmentId)),
          },
        ),
      );
    }
    if (readyAircraft.length === 0 && destinationSummaries.length > 0) {
      notes.append(createWarningItem('There are outbound jobs here, but no ready rentable aircraft on the field.'));
    }
    if (filters.excludedDestinations.size > 0) {
      notes.append(
        createWarningItem(
          `Excluded ${filters.excludedDestinations.size} destination${filters.excludedDestinations.size === 1 ? '' : 's'} with MSFS validation problems.`,
        ),
      );
    }
    if (filters.selectedAssignmentTypes.length === 0) {
      notes.append(createWarningItem('Select at least one job type.'));
    } else if (readyAircraft.length > 0 && destinationSummaries.length === 0) {
      notes.append(createWarningItem('No assignments match the current dispatch filters.'));
    }
    if (aircraft.length > 0 && readyAircraft.length === 0 && aircraft.some((candidate) => candidate.needsRepair)) {
      notes.append(createWarningItem('Every visible rental option appears blocked by repair status.'));
    }
    if (notes.childElementCount === 0) {
      notes.append(createEmptyState('No obvious dispatch signal was found for the current filters.'));
    }

    const nearbyAirportList = createList();
    if (nearestAirports.length === 0) {
      nearbyAirportList.append(createEmptyState('No nearby airports were found in the Close Airports table.'));
    } else if (isLoadingNearbyAirports) {
      nearbyAirportList.append(
        createEmptyState(`Loading assignments for ${nearestAirports.length} nearby airport${nearestAirports.length === 1 ? '' : 's'}...`),
      );
    } else if (nearbyAirportsError) {
      nearbyAirportList.append(createWarningItem(nearbyAirportsError));
    } else if (nearbyAirportResults.length > 0) {
      const nearbyAirportRows: Array<{
        icao: string;
        distanceNm: number | null;
        titleSuffix: string;
        details: string;
        totalPay: number;
      }> = [];

      nearbyAirportResults.forEach((airportResult) => {
        const airportAssignments = getFilteredAssignments(airportResult.assignments, filters);
        const airportDestinationSummaries = getDestinationSummaries(airportAssignments, filters);
        const airportBestTotalPayJob = getTopDestinationSummary(airportDestinationSummaries, 'totalPay');
        const airportBestPayPerMileJob = getTopDestinationSummary(airportDestinationSummaries, 'payPerNm');

        if (!airportBestTotalPayJob && !airportBestPayPerMileJob) {
          return;
        }

        if (airportBestTotalPayJob) {
          nearbyAirportRows.push({
            icao: airportResult.icao,
            distanceNm: airportResult.distanceNm,
            titleSuffix: 'Best total pay job',
            details: `${airportBestTotalPayJob.destination} • ${formatCurrency(airportBestTotalPayJob.totalPay)} • ${airportBestTotalPayJob.distanceNm} NM • ${formatSelectedPayload(airportBestTotalPayJob.selectedAssignments)} • ${airportBestTotalPayJob.assignmentCount} job${airportBestTotalPayJob.assignmentCount === 1 ? '' : 's'}`,
            totalPay: airportBestTotalPayJob.totalPay,
          });
        }

        if (airportBestPayPerMileJob) {
          nearbyAirportRows.push({
            icao: airportResult.icao,
            distanceNm: airportResult.distanceNm,
            titleSuffix: 'Best pay per mile job',
            details: `${airportBestPayPerMileJob.destination} • ${formatCurrency(getPayPerNm(airportBestPayPerMileJob))}/NM • ${formatCurrency(airportBestPayPerMileJob.totalPay)} • ${airportBestPayPerMileJob.distanceNm} NM • ${formatSelectedPayload(airportBestPayPerMileJob.selectedAssignments)} • ${airportBestPayPerMileJob.assignmentCount} job${airportBestPayPerMileJob.assignmentCount === 1 ? '' : 's'}`,
            totalPay: airportBestPayPerMileJob.totalPay,
          });
        }
      });

      nearbyAirportRows
        .sort((left, right) => {
          if (right.totalPay !== left.totalPay) {
            return right.totalPay - left.totalPay;
          }

          if (left.icao !== right.icao) {
            return left.icao.localeCompare(right.icao);
          }

          return left.titleSuffix.localeCompare(right.titleSuffix);
        })
        .forEach((row) => {
          const distanceSuffix = row.distanceNm != null ? ` • ${row.distanceNm.toFixed(1).replace(/\.0$/, '')} NM away` : '';
          nearbyAirportList.append(
            createSummaryRow(`${row.icao}${distanceSuffix} • ${row.titleSuffix}`, row.details, createAirportHref(row.icao)),
          );
        });

      if (nearbyAirportRows.length === 0) {
        nearbyAirportList.append(createEmptyState('No nearby airport assignments match the current dispatch filters.'));
      }
    } else {
      nearbyAirportList.append(createEmptyState('Fetch nearby airport jobs to compare alternate departure fields.'));
    }

    const nearbySection = createList();
    const nearbyHeading = document.createElement('div');
    nearbyHeading.textContent = 'Nearby airport alternatives';
    nearbyHeading.style.fontSize = '13px';
    nearbyHeading.style.fontWeight = '700';
    nearbyHeading.style.color = '#334155';
    nearbyHeading.style.textTransform = 'uppercase';
    nearbyHeading.style.letterSpacing = '0.04em';
    nearbySection.append(nearbyHeading, nearbyAirportList);

    if (excludedNearbyAirports.length > 0) {
      nearbySection.append(
        createWarningItem(
          `Excluded ${excludedNearbyAirports.length} nearby airport${excludedNearbyAirports.length === 1 ? '' : 's'} with MSFS 2020 validation issues.`,
        ),
      );
    }

    nearbyAirportsButton.disabled = isLoadingNearbyAirports || nearestAirports.length === 0;
    nearbyAirportsButton.textContent = isLoadingNearbyAirports ? 'Fetching nearby airport jobs...' : 'Fetch nearby airport jobs';

    content.replaceChildren(metrics, notes, nearbySection);
  };

  const syncSelectedAssignmentTypes = () => {
    const selectedTypes: Array<'T' | 'V' | 'A'> = [];
    if (tCheckbox.input.checked) selectedTypes.push('T');
    if (vCheckbox.input.checked) selectedTypes.push('V');
    if (aCheckbox.input.checked) selectedTypes.push('A');
    filters.selectedAssignmentTypes = selectedTypes;
  };

  [tCheckbox.input, vCheckbox.input, aCheckbox.input].forEach((checkbox) =>
    checkbox.addEventListener('change', () => {
      syncSelectedAssignmentTypes();
      render();
    }),
  );

  maxPassengerPayloadInput.addEventListener('input', () => {
    const parsed = Number.parseInt(maxPassengerPayloadInput.value, 10);
    filters.maxPassengerPayload = Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
    render();
  });

  maxRangeInput.addEventListener('input', () => {
    const parsed = Number.parseInt(maxRangeInput.value, 10);
    filters.maxRangeNm = Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
    render();
  });

  render();

  return section;
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

  const airportInfoColumn = findAirportInfoColumn();
  if (airportInfoColumn) {
    airportInfoColumn.style.width = '100%';
    airportInfoColumn.style.maxWidth = 'none';
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
  const assignments = getAirportAssignments();
  const aircraft = getAirportAircraft();
  const nearestAirports = getNearestAirports();

  const headerRow = createRow();
  headerRow.append(createBadge());
  const title = document.createElement('strong');
  title.textContent = 'Airport Dispatcher';
  headerRow.append(title);
  panel.append(headerRow);

  const sectionsRow = createSectionsRow();
  sectionsRow.append(createMsfsValidationSection(icao, coordinates));
  sectionsRow.append(createDispatchSummarySection(assignments, aircraft, nearestAirports));
  panel.append(sectionsRow);

  const actionButtonsRow = createActionButtonsRow();
  const mapsButtonRow = createLinkRow(
    'View Airport on Google Maps',
    `https://www.google.com/maps/@?api=1&map_action=map&center=${coordinates.googleMapsCenter}&zoom=14&basemap=satellite`,
  );
  const copyButtonRow = createButtonRow(`Copy Coordinates for MSFS (${coordinates.msfs})`, async () => {
    await navigator.clipboard.writeText(coordinates.msfs);
    window.alert(`Copied ${coordinates.msfs} to the clipboard.`);
  });
  actionButtonsRow.append(...Array.from(mapsButtonRow.children), ...Array.from(copyButtonRow.children));
  panel.append(actionButtonsRow);

  airportHelpersAnchor.insertAdjacentElement('afterend', panel);
  enhanceJobTableDestinationValidation();
  enhanceCloseAirportsValidation();
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
    const assignments = getAirportAssignments();
    const aircraft = getAirportAircraft();

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
      assignmentCount: assignments.length,
      assignmentDestinations: [...new Set(assignments.map((assignment) => assignment.destination))].length,
      aircraftCount: aircraft.length,
      rentableAircraftCount: aircraft.filter((candidate) => candidate.isRentableDry || candidate.isRentableWet).length,
      readyRentableAircraftCount: aircraft.filter(
        (candidate) => !candidate.needsRepair && (candidate.isRentableDry || candidate.isRentableWet),
      ).length,
    };
  },
};
