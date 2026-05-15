import { useStore } from '../../store/store';
import { Badge } from '../badge/badge';

export const OpenToggle = () => {
  const store = useStore();

  const handleOnCollapseButtonClick = () => {
    store.toggleCollapse();
  };

  return (
    <div className="fset-open-toggle">
      {store.isOpen && (
        <button type="button" className="fset-open-toggle__button" onClick={handleOnCollapseButtonClick}>
          <Badge label={'Close FSE Tools'} />
        </button>
      )}
      {!store.isOpen && (
        <button type="button" className="fset-open-toggle__button" onClick={handleOnCollapseButtonClick}>
          <Badge />
        </button>
      )}
    </div>
  );
};
