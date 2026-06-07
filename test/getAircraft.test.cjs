const assert = require('node:assert/strict');
const test = require('node:test');
const { aircraftList } = require('/tmp/fset-tests/data/aircraftList.js');
const { getAircraftIdByName, getAircraftNameById } = require('/tmp/fset-tests/utils/getAircraft.js');

test('getAircraftNameById returns the correct name for a valid id', () => {
  const aircraft = aircraftList[0];
  assert.equal(getAircraftNameById(aircraft.id), aircraft.name);
});

test('getAircraftNameById returns undefined for an invalid id', () => {
  assert.equal(getAircraftNameById(-1), undefined);
  assert.equal(getAircraftNameById(999999), undefined);
});

test('getAircraftIdByName returns the correct id for an exact name match', () => {
  const aircraft = aircraftList[0];
  assert.equal(getAircraftIdByName(aircraft.name), aircraft.id);
});

test('getAircraftIdByName returns undefined if no match is found', () => {
  assert.equal(getAircraftIdByName('Nonexistent Aircraft'), undefined);
});
