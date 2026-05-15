import { getAircraftTypeFromModelText } from '../utils/aircraftType';
import { SiteEnhancerDefinition } from './types';

const MY_FLIGHT_PATHNAME = 'myflight.jsp';

const getMyFlightElements = () => ({
  departureElement: document.querySelector<HTMLElement>('table.assignmentTable > tbody > tr > td:nth-child(4) > a'),
  arrivalElement: document.querySelector<HTMLElement>('table.assignmentTable > tbody > tr > td:nth-child(5) > a'),
  paxCountElement: document.querySelector<HTMLElement>(
    'div.myflight-assignments.myflight-assignments--ready > div > div > div.col-md-8 > table > tbody > tr:nth-child(2) > td:nth-child(5)',
  ),
  cargoWeightElement: document.querySelector<HTMLElement>(
    'div.myflight-assignments.myflight-assignments--ready > div > div > div.col-md-8 > table > tbody > tr:nth-child(2) > td:nth-child(7)',
  ),
  regElement: document.querySelector<HTMLElement>(
    'div.myflight-aircraft > div > div:nth-child(1) > div.myflight-aircraft--model > div:nth-child(1) > p > a',
  ),
  aircraftModelTextElement: document.querySelector<HTMLElement>('div.myflight-aircraft--model > div:nth-child(1) > h3'),
  statusElement: document.querySelector<HTMLElement>('.myflight-status'),
});

export const enhanceMyFlight = () => {
  // Modifiers
  if (window.location.href.split('?')[0].indexOf(MY_FLIGHT_PATHNAME) !== -1) {
    const hasFlight = !!document.querySelectorAll('.myflight-assignments--ready').length;

    if (hasFlight) {
      const {
        departureElement,
        arrivalElement,
        paxCountElement,
        cargoWeightElement,
        regElement,
        aircraftModelTextElement,
        statusElement,
      } = getMyFlightElements();

      if (
        !departureElement ||
        !arrivalElement ||
        !paxCountElement ||
        !cargoWeightElement ||
        !regElement ||
        !aircraftModelTextElement ||
        !statusElement
      ) {
        console.warn('One or more required elements are missing on the page.');
        return;
      }

      const aircraftTypeIcao: string | null = getAircraftTypeFromModelText(aircraftModelTextElement.innerText);
      const departure = departureElement.innerText.trim();
      const arrival = arrivalElement.innerText.trim();
      const pax = parseInt(paxCountElement.innerText);
      const cargoWeight = parseInt(cargoWeightElement.innerText);

      const simBriefUrl = `https://www.simbrief.com/system/dispatch.php?type=${aircraftTypeIcao}&reg=${
        regElement.innerText
      }&orig=${departure}&dest=${arrival}&pax=${pax.toString()}&cargo=${cargoWeight.toString()}`;
      console.log(`Simbrief URL: ${simBriefUrl}`);

      statusElement.insertAdjacentHTML(
        `beforebegin`,
        `
        <div style="border: 1px solid #000; padding: 10px; margin: 24px 0; background-color: #f0f0f0; border-radius: 5px; display: flex; align-items: center; gap: 10px;">
          <span class="fset-badge" style="
            display: inline-block;
            background: linear-gradient(to bottom, #66bb6a, #43a047);
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          ">FSE Tools</span>
          <span>
            Create a <a href="${simBriefUrl}" target="simbrief_flight_plan"><strong>SimBrief flightplan</strong></a> from ${departure} to ${arrival} for a ${aircraftTypeIcao} (Pax: ${pax} / Cargo: ${cargoWeight})
          </span>
        </div>
      `,
      );
    }
  }
};

export const myFlightEnhancer: SiteEnhancerDefinition = {
  id: 'myflight',
  debugLabel: 'My Flight',
  matchesCurrentPage: () => window.location.href.split('?')[0].indexOf(MY_FLIGHT_PATHNAME) !== -1,
  enhance: enhanceMyFlight,
  getDebugInfo: () => {
    const hasFlight = !!document.querySelector('.myflight-assignments--ready');
    const {
      departureElement,
      arrivalElement,
      paxCountElement,
      cargoWeightElement,
      regElement,
      aircraftModelTextElement,
      statusElement,
    } = getMyFlightElements();
    const aircraftTypeIcao = aircraftModelTextElement
      ? getAircraftTypeFromModelText(aircraftModelTextElement.innerText)
      : null;

    return {
      hasFlight,
      departure: departureElement?.innerText.trim() ?? null,
      arrival: arrivalElement?.innerText.trim() ?? null,
      pax: paxCountElement?.innerText.trim() ?? null,
      cargoWeight: cargoWeightElement?.innerText.trim() ?? null,
      registration: regElement?.innerText.trim() ?? null,
      aircraftModelText: aircraftModelTextElement?.innerText.trim() ?? null,
      aircraftTypeIcao,
      statusText: statusElement?.innerText.trim() ?? null,
      hasSimBriefLink: document.body.innerText.includes('SimBrief flightplan'),
      requiredElementsPresent: {
        departureElement: !!departureElement,
        arrivalElement: !!arrivalElement,
        paxCountElement: !!paxCountElement,
        cargoWeightElement: !!cargoWeightElement,
        regElement: !!regElement,
        aircraftModelTextElement: !!aircraftModelTextElement,
        statusElement: !!statusElement,
      },
    };
  },
};
