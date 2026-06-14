interface CorrectedAirport {
  icao: string; // The old/incorrect ICAO at FSE
  actualIcao: string; // The actual/current ICAO used in the world.
}

export const correctedAirports: CorrectedAirport[] = [
  {
    icao: 'EP0A',
    actualIcao: 'EPPW',
  },
  {
    icao: 'HEXX',
    actualIcao: 'HE38',
  },
  {
    icao: 'HL0A',
    actualIcao: 'HLUB',
  },
  {
    icao: 'KYUM',
    actualIcao: 'KNYL',
  },
  {
    icao: 'O48',
    actualIcao: 'KLLR',
  },
  {
    icao: 'URRR',
    actualIcao: 'URRP',
  },
];

// All ICAO's below are as used by FSEconomy
export const nonExistingAirports = [
  'EDDT', // Berlin Tegel Airport (closed airport)
  'LELC', // Does not exist in MSFS, but appears on Google Maps satellite images
  'LFSX', // Does not exist in MSFS, but appears blurred on Google Maps satellite images
  'LEZG', // Does not exist in MSFS, but appears on Google Maps satellite images
];

// All ICAO's below are as used by FSEconomy. They exist in the real world, but have no ICAO code.
export const airportsWithoutIcao = [
  'HL0L', // Actual militairy airport in Libya (https://en.wikipedia.org/wiki/Gamal_Abdel_Nasser_Airbase), but doesn't have an ICAO code
];
