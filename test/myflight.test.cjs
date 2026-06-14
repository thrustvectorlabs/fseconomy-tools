const assert = require('node:assert/strict');
const test = require('node:test');

const {
  buildSimBriefUrl,
  extractMyFlightData,
  getMyFlightElements,
} = require('/tmp/fset-tests/site-enhancers/myflight.js');

const createElement = (textContent) => ({ textContent });

const createRoot = (entries) => ({
  querySelector(selector) {
    return entries[selector] ?? null;
  },
});

test('buildSimBriefUrl encodes the expected SimBrief parameters', () => {
  const url = buildSimBriefUrl({
    aircraftTypeIcao: 'C208',
    arrival: 'KJFK',
    cargoWeight: 1450,
    departure: 'KLGA',
    pax: 9,
    registration: 'N208EX',
  });

  assert.equal(
    url,
    'https://www.simbrief.com/system/dispatch.php?cargo=1450&dest=KJFK&orig=KLGA&pax=9&reg=N208EX&type=C208',
  );
});

test('buildSimBriefUrl omits the type parameter when no aircraft ICAO is found', () => {
  const url = buildSimBriefUrl({
    aircraftTypeIcao: null,
    arrival: 'KJFK',
    cargoWeight: 1200,
    departure: 'KLGA',
    pax: 8,
    registration: 'N12345',
  });

  assert.equal(
    url,
    'https://www.simbrief.com/system/dispatch.php?cargo=1200&dest=KJFK&orig=KLGA&pax=8&reg=N12345',
  );
});

test('getMyFlightElements uses fallback selectors when the preferred ones are missing', () => {
  const root = createRoot({
    'table.assignmentTable > tbody > tr > td:nth-child(4) > a': createElement('KLGA'),
    'table.assignmentTable > tbody > tr > td:nth-child(5) > a': createElement('KJFK'),
    '.myflight-assignments--ready table tbody tr:nth-child(2) td:nth-child(5)': createElement('9'),
    '.myflight-assignments--ready table tbody tr:nth-child(2) td:nth-child(7)': createElement('1,450'),
    'div.myflight-aircraft > div > div:nth-child(1) > div.myflight-aircraft--model > div:nth-child(1) > p > a':
      createElement('N208EX'),
    'div.myflight-aircraft--model > div:nth-child(1) > h3': createElement('Cessna 208 Caravan'),
    '.myflight-status': createElement('Ready to fly'),
  });

  const elements = getMyFlightElements(root);

  assert.equal(elements.departureElement.textContent, 'KLGA');
  assert.equal(elements.arrivalElement.textContent, 'KJFK');
  assert.equal(elements.paxCountElement.textContent, '9');
  assert.equal(elements.cargoWeightElement.textContent, '1,450');
  assert.equal(elements.regElement.textContent, 'N208EX');
  assert.equal(elements.aircraftModelTextElement.textContent, 'Cessna 208 Caravan');
  assert.equal(elements.statusElement.textContent, 'Ready to fly');
});

test('extractMyFlightData returns normalized values from selected elements', () => {
  const flightData = extractMyFlightData({
    departureElement: createElement(' KLGA '),
    arrivalElement: createElement(' KJFK '),
    paxCountElement: createElement('9'),
    cargoWeightElement: createElement('1,450'),
    regElement: createElement('N208EX'),
    aircraftModelTextElement: createElement('Cessna 208 Caravan'),
    statusElement: createElement('Ready'),
  });

  assert.deepEqual(flightData, {
    aircraftTypeIcao: 'C208',
    arrival: 'KJFK',
    cargoWeight: 1450,
    departure: 'KLGA',
    pax: 9,
    registration: 'N208EX',
  });
});

test('extractMyFlightData returns null when required values are missing', () => {
  const flightData = extractMyFlightData({
    departureElement: createElement('KLGA'),
    arrivalElement: null,
    paxCountElement: createElement('9'),
    cargoWeightElement: createElement('1450'),
    regElement: createElement('N208EX'),
    aircraftModelTextElement: createElement('Cessna 208 Caravan'),
    statusElement: createElement('Ready'),
  });

  assert.equal(flightData, null);
});
