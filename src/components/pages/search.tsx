import { BUILD_TIME, PACKAGE_VERSION } from '../../build-info';
export const SearchPage = () => {
  return (
    <div className="fset-search-page">
      <div className="fset-search-form">
        <section className="fset-form-section">
          <div className="fset-form-section__header">
            <h2 className="fset-form-section__title">Overview</h2>
            <p className="fset-form-section__subtitle">
              FSE Tools is being prepared for a broader public release. The interactive search, assignment, and aircraft
              workflows are temporarily disabled while the release build is being finalized.
            </p>
          </div>
          <div className="fset-placeholder-copy">
            <p>The current menu confirms that the userscript is loaded and shows the current build details.</p>
            <p>
              Once the release work is complete, this area will expose the airport search, assignment review, and
              aircraft discovery tools again.
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
