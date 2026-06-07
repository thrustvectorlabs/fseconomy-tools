import { siteEnhancers } from './registry';

export const runSiteEnhancers = () => {
  siteEnhancers.forEach((enhancer) => enhancer.enhance());
};
