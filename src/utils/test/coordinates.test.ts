import { areCoordinatesNear, getCoordinateDifference, parseAirportCoordinates } from '../coordinates';

describe('parseAirportCoordinates', () => {
  it('parses FSE airport coordinates', () => {
    expect(parseAirportCoordinates('Lat: 52.31 N, Long: 4.76 E')).toEqual({
      latitude: 52.31,
      longitude: 4.76,
      msfs: '52.31N, 4.76E',
      googleMapsCenter: '52.31%2C4.76',
    });
  });
});

describe('getCoordinateDifference', () => {
  it('returns absolute latitude and longitude deltas', () => {
    const difference = getCoordinateDifference(
      { latitude: 52.3, longitude: 4.7 },
      { latitude: 52.312, longitude: 4.684 },
    );

    expect(difference.latitude).toBeCloseTo(0.012, 6);
    expect(difference.longitude).toBeCloseTo(0.016, 6);
  });
});

describe('areCoordinatesNear', () => {
  it('returns true when both coordinates are within tolerance', () => {
    expect(
      areCoordinatesNear(
        { latitude: 52.3, longitude: 4.7 },
        { latitude: 52.309, longitude: 4.691 },
        0.01,
      ),
    ).toBe(true);
  });

  it('returns false when latitude is outside tolerance', () => {
    expect(
      areCoordinatesNear(
        { latitude: 52.3, longitude: 4.7 },
        { latitude: 52.311, longitude: 4.691 },
        0.01,
      ),
    ).toBe(false);
  });

  it('returns false when longitude is outside tolerance', () => {
    expect(
      areCoordinatesNear(
        { latitude: 52.3, longitude: 4.7 },
        { latitude: 52.309, longitude: 4.689 },
        0.01,
      ),
    ).toBe(false);
  });
});
