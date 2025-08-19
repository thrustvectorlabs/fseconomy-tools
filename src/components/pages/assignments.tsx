import { AssignmentTable } from '../assignment-table/assignment-table';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';

export const AssignmentsPage = () => {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { pageName: 'Search', pageId: 'search' },
          { pageName: 'Assignments', pageId: 'assignments' },
        ]}
      />
      <div className="assignments">
        <AssignmentTable />
      </div>
    </>
  );
};
