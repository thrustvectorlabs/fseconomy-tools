import { getAircraftNameById, getAircraftIdByName } from '../getAircraft';
import { aircraftList } from '../../data/aircraftList';

describe('getAircraftNameById', () => {
  it('returns the correct name for a valid id', () => {
    const aircraft = aircraftList[0];
    expect(getAircraftNameById(aircraft.id)).toBe(aircraft.name);
  });

  it('returns undefined for an invalid id', () => {
    expect(getAircraftNameById(-1)).toBeUndefined();
    expect(getAircraftNameById(999999)).toBeUndefined();
  });
});

describe('getAircraftIdByName', () => {
  it('returns the correct id for an exact name match', () => {
    const aircraft = aircraftList[0];
    expect(getAircraftIdByName(aircraft.name)).toBe(aircraft.id);
  });

  it('returns undefined if no match is found', () => {
    expect(getAircraftIdByName('Nonexistent Aircraft')).toBeUndefined();
  });
});
