import { getAircraftTypeFromModelText } from '../utils/aircraftType';
import { SiteEnhancerDefinition } from './types';

const MY_FLIGHT_PATHNAME = 'myflight.jsp';
const ENHANCER_ID = 'fset-myflight-enhancer';

type QueryableRoot = {
  querySelector: <T extends Element = Element>(selector: string) => T | null;
};

type MyFlightElements = {
  departureElement: HTMLElement | null;
  arrivalElement: HTMLElement | null;
  paxCountElement: HTMLElement | null;
  cargoWeightElement: HTMLElement | null;
  regElement: HTMLElement | null;
  aircraftModelTextElement: HTMLElement | null;
  statusElement: HTMLElement | null;
};

type MyFlightData = {
  aircraftTypeIcao: string | null;
  arrival: string;
  cargoWeight: number;
  departure: string;
  pax: number;
  registration: string;
};

const firstMatching = <T extends HTMLElement>(root: QueryableRoot, selectors: string[]): T | null => {
  for (const selector of selectors) {
    const match = root.querySelector<T>(selector);
    if (match) {
      return match;
    }
  }

  return null;
};

const getElementText = (element: HTMLElement | null): string | null => {
  const text = element?.textContent?.trim();
  return text ? text : null;
};

const parseInteger = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const cleaned = value.replace(/,/g, '').trim();
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export const buildSimBriefUrl = (flightData: MyFlightData): string => {
  const params = new URLSearchParams({
    cargo: flightData.cargoWeight.toString(),
    dest: flightData.arrival,
    orig: flightData.departure,
    pax: flightData.pax.toString(),
    reg: flightData.registration,
  });

  if (flightData.aircraftTypeIcao) {
    params.set('type', flightData.aircraftTypeIcao);
  }

  return `https://www.simbrief.com/system/dispatch.php?${params.toString()}`;
};

export const getMyFlightElements = (root: QueryableRoot = document): MyFlightElements => ({
  departureElement: firstMatching(root, [
    '.myflight-assignments--ready table.assignmentTable tbody tr td:nth-child(4) a',
    'table.assignmentTable > tbody > tr > td:nth-child(4) > a',
  ]),
  arrivalElement: firstMatching(root, [
    '.myflight-assignments--ready table.assignmentTable tbody tr td:nth-child(5) a',
    'table.assignmentTable > tbody > tr > td:nth-child(5) > a',
  ]),
  paxCountElement: firstMatching(root, [
    '.myflight-assignments--ready td[data-title="Pax"]',
    '.myflight-assignments--ready table tbody tr:nth-child(2) td:nth-child(5)',
  ]),
  cargoWeightElement: firstMatching(root, [
    '.myflight-assignments--ready td[data-title="Cargo"]',
    '.myflight-assignments--ready table tbody tr:nth-child(2) td:nth-child(7)',
  ]),
  regElement: firstMatching(root, [
    '.myflight-aircraft--model p a',
    'div.myflight-aircraft > div > div:nth-child(1) > div.myflight-aircraft--model > div:nth-child(1) > p > a',
  ]),
  aircraftModelTextElement: firstMatching(root, [
    '.myflight-aircraft--model h3',
    'div.myflight-aircraft--model > div:nth-child(1) > h3',
  ]),
  statusElement: firstMatching(root, ['.myflight-status']),
});

export const extractMyFlightData = (elements: MyFlightElements): MyFlightData | null => {
  const departure = getElementText(elements.departureElement);
  const arrival = getElementText(elements.arrivalElement);
  const registration = getElementText(elements.regElement);
  const aircraftModelText = getElementText(elements.aircraftModelTextElement);
  const pax = parseInteger(getElementText(elements.paxCountElement));
  const cargoWeight = parseInteger(getElementText(elements.cargoWeightElement));

  if (!departure || !arrival || !registration || !aircraftModelText || pax === null || cargoWeight === null) {
    return null;
  }

  return {
    aircraftTypeIcao: getAircraftTypeFromModelText(aircraftModelText),
    arrival,
    cargoWeight,
    departure,
    pax,
    registration,
  };
};

const createEnhancerPanel = (flightData: MyFlightData, simBriefUrl: string): HTMLDivElement => {
  const panel = document.createElement('div');
  panel.id = ENHANCER_ID;
  panel.style.border = '1px solid #000';
  panel.style.padding = '10px';
  panel.style.margin = '24px 0';
  panel.style.backgroundColor = '#f0f0f0';
  panel.style.borderRadius = '5px';
  panel.style.display = 'flex';
  panel.style.alignItems = 'center';
  panel.style.gap = '10px';

  const badge = document.createElement('span');
  badge.className = 'fset-badge';
  badge.style.display = 'inline-block';
  badge.style.background = 'linear-gradient(to bottom, #66bb6a, #43a047)';
  badge.style.color = 'white';
  badge.style.fontSize = '14px';
  badge.style.fontWeight = 'bold';
  badge.style.padding = '4px 8px';
  badge.style.borderRadius = '3px';
  badge.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
  badge.textContent = 'FSE Tools';

  const content = document.createElement('span');
  const link = document.createElement('a');
  link.href = simBriefUrl;
  link.target = 'simbrief_flight_plan';

  const strong = document.createElement('strong');
  strong.textContent = 'SimBrief flightplan';
  link.append(strong);

  content.append('Create a ');
  content.append(link);
  content.append(
    ` from ${flightData.departure} to ${flightData.arrival} for a ${flightData.aircraftTypeIcao ?? 'matching aircraft'} (Pax: ${flightData.pax} / Cargo: ${flightData.cargoWeight})`,
  );

  panel.append(badge, content);
  return panel;
};

const enhanceMyFlight = () => {
  if (!window.location.pathname.endsWith(MY_FLIGHT_PATHNAME)) {
    return;
  }

  const hasFlight = !!document.querySelector('.myflight-assignments--ready');
  if (!hasFlight || document.getElementById(ENHANCER_ID)) {
    return;
  }

  const elements = getMyFlightElements();
  if (Object.values(elements).some((value) => !value)) {
    console.warn('One or more required elements are missing on the page.');
    return;
  }

  const flightData = extractMyFlightData(elements);
  if (!flightData || !elements.statusElement) {
    console.warn('FSE Tools: My Flight data could not be extracted.');
    return;
  }

  const simBriefUrl = buildSimBriefUrl(flightData);
  elements.statusElement.insertAdjacentElement('beforebegin', createEnhancerPanel(flightData, simBriefUrl));
};

export const myFlightEnhancer: SiteEnhancerDefinition = {
  id: 'myflight',
  debugLabel: 'My Flight',
  matchesCurrentPage: () => window.location.pathname.endsWith(MY_FLIGHT_PATHNAME),
  enhance: enhanceMyFlight,
  getDebugInfo: () => {
    const hasFlight = !!document.querySelector('.myflight-assignments--ready');
    const elements = getMyFlightElements();
    const flightData = extractMyFlightData(elements);

    return {
      hasFlight,
      departure: flightData?.departure ?? null,
      arrival: flightData?.arrival ?? null,
      pax: flightData?.pax ?? null,
      cargoWeight: flightData?.cargoWeight ?? null,
      registration: flightData?.registration ?? null,
      aircraftModelText: getElementText(elements.aircraftModelTextElement),
      aircraftTypeIcao: flightData?.aircraftTypeIcao ?? null,
      statusText: getElementText(elements.statusElement),
      hasSimBriefLink: document.body.innerText.includes('SimBrief flightplan'),
      enhancerInjected: !!document.getElementById(ENHANCER_ID),
      requiredElementsPresent: {
        departureElement: !!elements.departureElement,
        arrivalElement: !!elements.arrivalElement,
        paxCountElement: !!elements.paxCountElement,
        cargoWeightElement: !!elements.cargoWeightElement,
        regElement: !!elements.regElement,
        aircraftModelTextElement: !!elements.aircraftModelTextElement,
        statusElement: !!elements.statusElement,
      },
    };
  },
};
