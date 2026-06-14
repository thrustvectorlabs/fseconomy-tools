import { airportEnhancer } from './airport';
import { myFlightEnhancer } from './myflight';
import type { SiteEnhancerDefinition } from './types';

export const siteEnhancers: SiteEnhancerDefinition[] = [
  airportEnhancer,
  myFlightEnhancer,
];
