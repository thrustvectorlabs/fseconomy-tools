import { Config } from './types/types';

export const config: Config = {
  baseUrl: 'https://server.fseconomy.net/',
  aircraftToSelect: [
    { modelId: 22, rentable: true }, // Cessna 208
    { modelId: 361, rentable: false }, // Airbus A320 (MSFS)
    { modelId: 375, rentable: true }, // Cessna Citation Longitude
  ],
  airportsToSelect: ['EHAM', 'LOWI', 'KDEN', 'SPZO', 'VNLK'],
};
