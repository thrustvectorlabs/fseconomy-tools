import { config } from '../config';
import { useStore } from '../store/store';
import { Aircraft, Assignment } from '../types/types';
import { extractPayload } from '../utils/assignments';
import { extractTableCellValuesFromRow } from '../utils/extractTableCellValuesFromRow';
import { getAircraftIdByName } from '../utils/getAircraft';

/** Local shared types for clarity */
interface AirportData {
  assignments: Assignment[];
  aircraft: Aircraft[];
}

type AssignmentType = 'T' | 'A' | 'V';
type PayloadUnit = 'pax' | 'kg';

/** Dev-gated logger */
const logInfo = (...args: unknown[]) => {
  if (config.developmentMode) console.info(...args);
};
const logWarn = (...args: unknown[]) => {
  if (config.developmentMode) console.warn(...args);
};

/** Parsing helpers */
const toInteger = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const cleanCurrency = (value: string): string => value.replace(/[$,]/g, '').trim();

const parseCurrencyToNumber = (value: string | null | undefined): number | null => {
  if (!value) return null;
  const cleaned = cleanCurrency(value);
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const getOptionalCell = (cells: string[], index: number): string | null =>
  index >= 0 && index < cells.length ? cells[index] : null;

/** Payload unit inference */
const inferPayloadUnit = (assignmentType: AssignmentType, description: string): PayloadUnit => {
  if (assignmentType === 'V' || assignmentType === 'A') return 'pax';
  // T-type: passengers unless the word “Cargo” appears
  return description.includes('Cargo') ? 'kg' : 'pax';
};

/** Distance bonus: accepts "$12,345" anywhere in the string; returns 0 if absent */
const getDistanceBonus = (tdCellText: string): number => {
  const match = tdCellText.match(/\$(\d[\d,]*)/);
  if (!match) {
    logWarn(`No distance bonus found in cell: ${tdCellText}`);
    return 0;
  }
  const numeric = Number(match[1].replace(/,/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
};

/** Adds airport information to the store, if found */
const addAirportToStore = (icao: string, dom: Document): void => {
  const airportNameElement = dom.querySelector('div.panel-body.airportInfo > div > div > div:nth-child(1)');
  const airportText = airportNameElement?.textContent?.trim() ?? '';
  const [name = '', city = '', country = ''] = airportText.split(', ').map((s) => s.trim());

  useStore.getState().addAirport([{ icao, name, city, country }]);
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

/** Extract aircraft rows from DOM for a specific ICAO and modelId */
const getAircraftData = (dom: Document, icao: string, aircraftModelId: number): Aircraft[] => {
  const aircraftRows: HTMLElement[] = Array.from(dom.querySelectorAll('#acTable > tbody > tr'));
  const searchFormParameters = useStore.getState().searchFormParameters;

  if (!searchFormParameters) {
    logWarn('searchFormParameters is null, skipping aircraft data extraction.');
    return [];
  }

  const shouldBeRentable =
    config.aircraftToSelect.find((aircraft) => aircraft.modelId === aircraftModelId)?.rentable ?? true;

  const result = aircraftRows
    .map((aircraftRow): Aircraft | undefined => {
      const cells = extractTableCellValuesFromRow(aircraftRow);
      // Expected columns: [0]=registration, [1]=type, [3]=home, [4]=bonus, [5]=price cell text
      const registration = getOptionalCell(cells, 0)?.replace('*', '').trim();
      const type = getOptionalCell(cells, 1)?.trim();
      const homeIcao = getOptionalCell(cells, 3)?.trim();
      const bonusCell = getOptionalCell(cells, 4) ?? '';
      const priceCell = aircraftRow.querySelectorAll('td')[5];

      const priceDry = priceCell ? extractRentalPriceFromElement(priceCell, 'Dry') : null;
      const priceWet = priceCell ? extractRentalPriceFromElement(priceCell, 'Wet') : null;

      if (!registration || !type || !homeIcao) {
        logWarn(`Skipping aircraft row due to missing essential data at ${icao}`, { registration, type, homeIcao });
        return;
      }

      const distanceBonus = getDistanceBonus(bonusCell);
      const rowAircraftModelId = getAircraftIdByName(type);

      if (rowAircraftModelId !== aircraftModelId) {
        logInfo(`Ignoring ${registration} (${type}) at ${icao} due to wrong model`);
        return;
      }

      if (distanceBonus > searchFormParameters.maxDistanceBonus) {
        logInfo(
          `Ignoring ${registration} (${type}) at ${icao} due to distance bonus ${distanceBonus}. Max allowed is ${searchFormParameters.maxDistanceBonus}`,
        );
        return;
      }

      // Repair image is in the first (index 0) td.
      const needsRepair = Boolean(aircraftRow.querySelector('td img[src="img/repair.gif"]'));

      const isRentableDry = !!priceDry;
      const isRentableWet = !!priceWet;

      if (shouldBeRentable && !isRentableDry && !isRentableWet) {
        logInfo(`Ignoring ${registration} (${type}) at ${icao} as it is not rentable`);
        return;
      }

      logInfo(
        `Adding: ${registration} (${type}) at ${icao} | bonus ${distanceBonus} | needsRepair=${needsRepair} | dry=${isRentableDry} wet=${isRentableWet}`,
      );

      return {
        stationedAtIcao: icao,
        registration,
        type,
        homeIcao,
        rentalPriceDry: priceDry || null,
        rentalPriceWet: priceWet || null,
        distanceBonus,
        isRentableDry,
        isRentableWet,
        needsRepair,
      };
    })
    .filter((aircraft): aircraft is Aircraft => aircraft !== undefined);

  useStore.getState().addAircraft(result);
  return result;
};

/** Extract assignments from DOM for a specific ICAO */
const getAssignments = (dom: Document, icao: string): Assignment[] => {
  const assignmentRows: HTMLElement[] = Array.from(dom.querySelectorAll('#jobTable > tbody > tr'));
  if (assignmentRows.length === 0) {
    return [];
  }

  const result = assignmentRows
    .map((assignmentRow): Assignment | undefined => {
      const cells = extractTableCellValuesFromRow(assignmentRow);

      // Expected: [1]=pay, [3]=destination, [4]=distance, [5]=bearing, [6]=payload text, [7]=type+?, [8]=aircraft? [9]=expires
      const payText = getOptionalCell(cells, 1);
      const destination = getOptionalCell(cells, 3)?.trim();
      const distanceText = getOptionalCell(cells, 4);
      const bearingText = getOptionalCell(cells, 5);
      const payloadText = getOptionalCell(cells, 6)?.trim() ?? '';
      const typeCell = getOptionalCell(cells, 7) ?? '';
      const aircraftText = getOptionalCell(cells, 8)?.trim();
      const expires = getOptionalCell(cells, 9)?.trim() ?? '';

      const assignmentType = typeCell.substring(0, 1) as AssignmentType;
      const pay = parseCurrencyToNumber(payText) ?? 0;
      const distance = toInteger(distanceText) ?? 0;
      const bearing = toInteger(bearingText) ?? 0;

      const isPassengerTerminalAssignment =
        assignmentRow.querySelectorAll('td')[6]?.querySelector('font[color="Green"]') !== null;

      if (pay <= 0 || !destination) {
        // Skip non-paying or malformed rows
        return undefined;
      }

      const checkbox = assignmentRow.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
      if (!checkbox || !checkbox.value) {
        logWarn(`Skipping assignment at ${icao} due to missing checkbox/value`);
        return undefined;
      }

      const payloadUnit = inferPayloadUnit(assignmentType, payloadText);

      return {
        assignmentId: Number.parseInt(checkbox.value, 10),
        assignmentType,
        pay,
        origin: icao,
        destination,
        distance,
        bearing,
        expires,
        payload: extractPayload(payloadText, assignmentType),
        payloadUnit,
        payloadString: payloadText,
        aircraftRegistration: aircraftText && aircraftText !== '[N/A]' ? aircraftText : undefined,
        isPassengerTerminalAssignment,
      };
    })
    .filter((assignment): assignment is Assignment => assignment !== undefined);

  useStore.getState().addAssignments(result);
  return result;
};

/** Orchestrates fetching + parsing + store updates; returns structured results */
export const fetchDataFromAirport = async (icao: string, aircraftModelId: number): Promise<AirportData> => {
  const response = await fetch(`${config.baseUrl}/airport.jsp?icao=${icao}`);
  const html = await response.text();

  const domparser = new DOMParser();
  const dom = domparser.parseFromString(html, 'text/html');

  const aircraftOnAirport = getAircraftData(dom, icao, aircraftModelId);

  // Only fetch assignments if there are aircraft listed for this ICAO
  let assignmentsOnAirport: Assignment[] = [];
  if (aircraftOnAirport.length > 0) {
    assignmentsOnAirport = getAssignments(dom, icao);
  }

  addAirportToStore(icao, dom);

  return {
    assignments: assignmentsOnAirport,
    aircraft: aircraftOnAirport,
  };
};
