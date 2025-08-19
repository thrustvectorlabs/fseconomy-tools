import { useStore } from '../../store/store';

interface Breadcrumb {
  pageName: string;
  pageId: string;
}

interface BreadcrumbsProps {
  crumbs?: Breadcrumb[];
}

export const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  const setPageToShow = useStore((state) => state.setPageToShow);

  if (!crumbs || crumbs.length === 0) {
    crumbs = [{ pageName: 'Search', pageId: 'search' }];
  }

  return (
    <div className="fset-breadcrumbs">
      {crumbs?.map((crumb, index) => (
        <span className="fset-breadcrumbs__crumb" key={crumb.pageId}>
          <button onClick={() => setPageToShow(crumb.pageId)}>{crumb.pageName}</button>
          {index < crumbs.length - 1 && <span className="fset-breadcrumbs__separator"> &gt; </span>}
        </span>
      ))}
    </div>
  );
};
