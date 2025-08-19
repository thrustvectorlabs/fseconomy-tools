// Instructions:
// - Copy this file to config.ts and prefix `const config` with `export`. It contains a working config for the aircraft listed in the comments.
// - To extend the list of aircraftToSelect: check out ./data/aircraftList.ts and add the corresponding ID to the list below.
// - Set rentable to the correct value manually. E.g. jetliners reserved typically for assignments should be set to 'rentable: false'

import { Config } from './types/types';

const config: Config = {
  baseUrl: 'https://server.fseconomy.net/',
  aircraftToSelect: [
    { modelId: 22, rentable: true }, // Cessna 208
    { modelId: 361, rentable: false }, // Airbus A320 (MSFS)
    { modelId: 375, rentable: true }, // Cessna Citation Longitude
  ],
  airportsToSelect: ['EHAM', 'LOWI', 'KDEN', 'SPZO', 'VNLK'],
};
