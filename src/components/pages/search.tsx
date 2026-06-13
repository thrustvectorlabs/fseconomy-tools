import { BUILD_TIME, PACKAGE_VERSION } from '../../build-info';
export const SearchPage = () => {
  return (
    <div className="fset-search-page">
      <div className="fset-search-form">
        <section className="fset-form-section">
          <div className="fset-form-section__header">
            <h2 className="fset-form-section__title">Overview</h2>
            <p className="fset-form-section__subtitle">
              FSE Tools is currently in beta. Currently the Airport Dispatcher on the Airport page is implemented, and
              more features are in development.
            </p>
          </div>
        </section>

        <section className="fset-form-section">
          <div className="fset-form-section__header">
            <h2 className="fset-form-section__title">Build Information</h2>
            <p className="fset-form-section__subtitle">Basic release metadata for the currently loaded bundle.</p>
          </div>
          <div className="fset-form-grid">
            <div className="fset-placeholder-label">Version</div>
            <div className="fset-placeholder-value">{PACKAGE_VERSION}</div>
            <div className="fset-placeholder-label">Build Time</div>
            <div className="fset-placeholder-value">{BUILD_TIME}</div>
            <div className="fset-placeholder-label">Status</div>
            <div className="fset-placeholder-value">Release preparation</div>
          </div>
        </section>
        <section className="fset-form-section">
          <div className="fset-form-section__header">
            <h2 className="fset-form-section__title">Disclaimer</h2>
            <p className="fset-form-section__subtitle">
              FSE Tools is currently in beta and still in development. The author is not affiliated with the FSEconomy
              Team and is not responsible for any damage or issues you believe may be caused by this software.
            </p>
          </div>
        </section>

        {/* Hidden for this version; keep structure available for later re-enable. */}
        {/*
        <section className="fset-form-section fset-form-section--compact">
          <div className="fset-search-actions">
            <button name="fse_tools_search" type="button" className="fset-button search-button" disabled>
              Search aircraft (coming soon)
            </button>
          </div>
          <StoreStatistics />
        </section>
        */}
      </div>
    </div>
  );
};
