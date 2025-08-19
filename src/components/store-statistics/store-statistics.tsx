import { useStore } from '../../store/store';

export const StoreStatistics = () => {
  const aircraftCount = useStore((state) => state.aircraft.length);
  const assignmentCount = useStore((state) => state.assignments.length);

  return (
    <div className="stats">
      <h4>Store Statistics</h4>
      <div>
        Aircraft: <strong>{aircraftCount}</strong>
      </div>
      <div>
        Assignments: <strong>{assignmentCount}</strong>
      </div>
    </div>
  );
};
