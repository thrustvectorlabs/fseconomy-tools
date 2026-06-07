import { aircraftLogEnhancer } from './aircraftlog';
import { airportEnhancer } from './airport';
import { fbosForSaleEnhancer } from './fbosforsale';
import { myFlightEnhancer } from './myflight';
import { SiteEnhancerDefinition } from './types';

export const siteEnhancers: SiteEnhancerDefinition[] = [
  aircraftLogEnhancer,
  airportEnhancer,
  fbosForSaleEnhancer,
  myFlightEnhancer,
];

export const getMatchingSiteEnhancer = (): SiteEnhancerDefinition | null =>
  siteEnhancers.find((enhancer) => enhancer.matchesCurrentPage()) ?? null;
