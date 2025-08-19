import { AircraftTable } from '../aircraft-table/aircraft-table';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';

export const AircraftPage = () => {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { pageName: 'Search', pageId: 'search' },
          { pageName: 'Aircraft', pageId: 'aircraft' },
        ]}
      />
      <div className="aircraft">
        <AircraftTable />
      </div>
    </>
  );
};
