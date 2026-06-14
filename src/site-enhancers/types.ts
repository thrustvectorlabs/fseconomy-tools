interface SiteEnhancerDebugInfo {
  [key: string]: unknown;
}

export interface SiteEnhancerDefinition {
  debugLabel: string;
  id: string;
  enhance: () => void;
  getDebugInfo: () => SiteEnhancerDebugInfo;
  matchesCurrentPage: () => boolean;
}
