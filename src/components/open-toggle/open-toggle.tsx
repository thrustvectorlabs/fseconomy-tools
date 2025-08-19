import { useStore } from '../../store/store';
import { Badge } from '../badge/badge';

export const OpenToggle = () => {
  const store = useStore();

  const handleOnCollapseButtonClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    store.toggleCollapse();
  };

  return (
    <div>
      {store.isOpen && (
        <a href="#" onClick={handleOnCollapseButtonClick}>
          <Badge label={'Close FSE Tools'} />
        </a>
      )}
      {!store.isOpen && (
        <a href="#" onClick={handleOnCollapseButtonClick}>
          <Badge />
        </a>
      )}
    </div>
  );
};
