import { aircraftList } from '../data/aircraftList';

export const getAircraftNameById = (id: number) => {
  const aircraft = aircraftList.find((a) => a.id === id);
  return aircraft ? aircraft.name : undefined;
};

export const getAircraftIdByName = (name: string) => {
  const result = aircraftList.filter((aircraft) => {
    return aircraft.name === name;
  });

  return result[0]?.id || undefined;
};
