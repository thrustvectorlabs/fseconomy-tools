import { enhanceAircraftLog } from './aircraftlog';
import { enhanceAirport } from './airport';
import { enhanceFbosForSale } from './fbosforsale';
import { enhanceMyFlight } from './myflight';

export const runSiteEnhancers = () => {
  enhanceAircraftLog();
  enhanceAirport();
  enhanceFbosForSale();
  enhanceMyFlight();
};
