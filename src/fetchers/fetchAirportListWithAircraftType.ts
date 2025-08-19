import { config } from '../config';
import { extractTableCellValuesFromRow } from '../utils/extractTableCellValuesFromRow';
import { generateFormData } from '../utils/generateFormData';

const extractAirports = (dom: Document) => {
  let rows = [];
  if (dom.querySelector('.airportInfo')) {
    console.info('On Airport Page - ABORT.');
    return false;
  } else {
    rows = Array.from(dom.querySelectorAll('#searchTable > tbody > tr'));
  }

  console.info('On Search Results Page');

  const result = rows.map((row) => {
    const values = extractTableCellValuesFromRow(row as HTMLElement);

    console.info('Airport found:', values[0], values[3]);

    return {
      icao: values[0],
      distance: values[1],
      bearing: values[2],
      name: values[3],
      country: values[4],
    };
  });

  return result;
};

export const fetchAirportListWithAircraftType = async (model: number, from: string, distance: number) => {
  const foundAircraft = config.aircraftToSelect.find((aircraft) => aircraft.modelId === model);
  const rentable = foundAircraft ? foundAircraft.rentable || false : false;

  return await fetch(`${config.baseUrl}/airport.jsp`, {
    method: 'POST',
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Cache-Control': 'max-age=0',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
    },
    body: generateFormData({
      icao: '',
      registration: '',
      name: '',
      model,
      distance,
      from: from.toLowerCase(),
      assignments: 'assignments',
      goodsMode: 'sell',
      commodity: '',
      ...(rentable && { rentable: 'rentable' }),
      submit: 'true',
    }),
  })
    .then((response) => response.text())
    .then((data) => {
      const domparser = new DOMParser();
      const dom = domparser.parseFromString(data, 'text/html');
      return extractAirports(dom);
    });
};

// icao=&registration=&name=&model=22&rentable=rentable&assignments=assignments&distance=100&from=EHAM&goodsMode=sell&commodity=&minAmount=100&submit=true
