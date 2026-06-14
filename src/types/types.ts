export interface Aircraft {
  stationedAtIcao: string;
  registration: string;
  type: string;
  homeIcao: string;
  rentalPriceDry: number | null;
  rentalPriceWet: number | null;
  distanceBonus: number;
  isRentableDry: boolean;
  isRentableWet: boolean;
  needsRepair: boolean;
}

export interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
  // elevation: number;
  // lat: number;
  // lon: number;
}

export interface Assignment {
  assignmentId: number; // Taken from the checkbox value
  assignmentType: 'T' | 'A' | 'V';
  pay: number;
  origin: string;
  destination: string;
  distance: number;
  bearing: number;
  expires: string;
  payload: number;
  payloadUnit: 'pax' | 'kg';
  payloadString: string; // The text displayed in the table.
  aircraftRegistration?: string;
  isPassengerTerminalAssignment: boolean;
}

export interface Config {
  baseUrl: string;
  aircraftToSelect: Array<{
    modelId: number;
    rentable: boolean;
  }>;
  airportsToSelect: Array<string>;
  developmentMode?: boolean;
}

export interface SearchFormParameters {
  aircraftModelId: number;
  departureAirport: string;
  departureAirportOverride: string;
  radius: number;
  maxDistanceBonus: number;
}
