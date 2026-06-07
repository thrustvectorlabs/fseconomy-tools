const assert = require('node:assert/strict');
const test = require('node:test');
const {
  areCoordinatesNear,
  getCoordinateDifference,
  parseAirportCoordinates,
} = require('/tmp/fset-tests/utils/coordinates.js');

test('parseAirportCoordinates parses FSE airport coordinates', () => {
  assert.deepEqual(parseAirportCoordinates('Lat: 52.31 N, Long: 4.76 E'), {
    latitude: 52.31,
    longitude: 4.76,
    msfs: '52.31N, 4.76E',
    googleMapsCenter: '52.31%2C4.76',
  });
});

test('getCoordinateDifference returns absolute latitude and longitude deltas', () => {
  const difference = getCoordinateDifference(
    { latitude: 52.3, longitude: 4.7 },
    { latitude: 52.312, longitude: 4.684 },
  );

  assert.ok(Math.abs(difference.latitude - 0.012) < 1e-6);
  assert.ok(Math.abs(difference.longitude - 0.016) < 1e-6);
});

test('areCoordinatesNear returns true when both coordinates are within tolerance', () => {
  assert.equal(
    areCoordinatesNear(
      { latitude: 52.3, longitude: 4.7 },
      { latitude: 52.309, longitude: 4.691 },
      0.01,
    ),
    true,
  );
});

test('areCoordinatesNear returns false when latitude is outside tolerance', () => {
  assert.equal(
    areCoordinatesNear(
      { latitude: 52.3, longitude: 4.7 },
      { latitude: 52.311, longitude: 4.691 },
      0.01,
    ),
    false,
  );
});

test('areCoordinatesNear returns false when longitude is outside tolerance', () => {
  assert.equal(
    areCoordinatesNear(
      { latitude: 52.3, longitude: 4.7 },
      { latitude: 52.309, longitude: 4.689 },
      0.01,
    ),
    false,
  );
});
