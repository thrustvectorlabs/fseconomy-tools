import type { AircraftListTextIcao } from './aircraftListTextIcao';

/**
 * Overrides the default ICAO match to another type.
 * @todo This should actually be configuration.
 */
export const aircraftListTextIcaoOverrides: AircraftListTextIcao[] = [
  {
    text: 'Airbus A320',
    icao: 'A20N',
  },
];
