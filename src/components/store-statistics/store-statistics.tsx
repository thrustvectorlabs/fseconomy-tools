import { useStore } from '../../store/store';

export const StoreStatistics = () => {
  const aircraftCount = useStore((state) => state.aircraft.length);
  const assignmentCount = useStore((state) => state.assignments.length);

  return (
    <div className="stats">
      <h4>Store Statistics</h4>
      <div className="stats__card">
        <span className="stats__label">Aircraft</span>
        <strong className="stats__value">{aircraftCount}</strong>
      </div>
      <div className="stats__card">
        <span className="stats__label">Assignments</span>
        <strong className="stats__value">{assignmentCount}</strong>
      </div>
    </div>
  );
};
