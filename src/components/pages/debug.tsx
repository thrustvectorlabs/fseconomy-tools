import { getMatchingSiteEnhancer } from '../../site-enhancers/registry';

export const DebugPage = () => {
  const matchingEnhancer = getMatchingSiteEnhancer();

  if (!matchingEnhancer) {
    return <p>This page does not have an FSE Tools site enhancer.</p>;
  }

  const debugInfo = matchingEnhancer.getDebugInfo();
  const url = new URL(window.location.href);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  return (
    <section className="debug-page">
      <div className="debug-page__summary">
        <div>
          <strong>Enhancer:</strong> {matchingEnhancer.debugLabel}
        </div>
        <div>
          <strong>Enhancer ID:</strong> {matchingEnhancer.id}
        </div>
        <div>
          <strong>Path:</strong> {url.pathname}
        </div>
        <div>
          <strong>Query:</strong> {Object.keys(queryParams).length ? JSON.stringify(queryParams) : 'none'}
        </div>
      </div>

      <pre className="debug-page__output">{JSON.stringify(debugInfo, null, 2)}</pre>
    </section>
  );
};
