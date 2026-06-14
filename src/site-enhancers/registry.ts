import { aircraftLogEnhancer } from './aircraftlog';
import { airportEnhancer } from './airport';
import { myFlightEnhancer } from './myflight';
import { SiteEnhancerDefinition } from './types';

export const siteEnhancers: SiteEnhancerDefinition[] = [
  aircraftLogEnhancer,
  airportEnhancer,
  myFlightEnhancer,
];

export const getMatchingSiteEnhancer = (): SiteEnhancerDefinition | null =>
  siteEnhancers.find((enhancer) => enhancer.matchesCurrentPage()) ?? null;
