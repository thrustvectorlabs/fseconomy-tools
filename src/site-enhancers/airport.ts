// @ts-nocheck - File disabled: This file is temporarily disabled due to ongoing changes in the FSEconomy airport page.
import { nonExistingAirports } from '../data/airportMap';
import { getCorrectedAirportForIcao } from '../utils/airport';

const parseCoordinatesForGoogleMaps = (coordinatesString: string): string | null => {
  const filteredCoordinates = coordinatesString.replace('Lat: ', '').replace(' Long: ', '');

  // Regular expression to extract numbers and letters from the string
  const regex = /([0-9.]+)([NS]),([0-9.]+)([EW])/i;

  // Use regex to match and extract latitude, longitude, and direction
  const matches = filteredCoordinates.match(regex);

  if (matches && matches.length === 5) {
    const latitude = parseFloat(matches[1]) * (matches[2].toUpperCase() === 'N' ? 1 : -1);
    const longitude = parseFloat(matches[3]) * (matches[4].toUpperCase() === 'E' ? 1 : -1);

    return `${latitude}%2C${longitude}`;
  } else {
    console.error('Invalid coordinate format');
    return null;
  }
};

export const enhanceAirport = () => {
  // @TODO Disabled temporarily, as FSE is renewing the airport page.
  return;
  const urlParams = new URLSearchParams(window.location.search);
  const icao = urlParams.get('icao');

  if (window.location.href.split('?')[0].indexOf('airport.jsp') !== -1) {
    if (icao) {
      // Assume Airport Detail page
      const airportCoordsElement: HTMLElement | null = document.querySelector(
        'div.airportInfo > table > tbody > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3)',
      );
      const elevationElement: HTMLElement | null = document.querySelector(
        'div.airportInfo > table > tbody > tr:nth-child(1) > td:nth-child(1) > div:nth-child(4)',
      );
      const icaoElement: HTMLElement | null = document.querySelector(
        'div.airportInfo > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(1) > h1',
      );

      if (!airportCoordsElement || !elevationElement || !icaoElement) {
        console.warn('One or more required elements are missing on the page.');
        return;
      }

      const icao = icaoElement.innerText.trim();
      const coordsRaw = airportCoordsElement.innerText; // e.g. Lat: 47.7872N, Long: 6.365E
      const coordsMsfs = coordsRaw.replace('Lat: ', '').replace(' Long: ', '');
      const googleMapsUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${parseCoordinatesForGoogleMaps(
        coordsRaw,
      )}&zoom=14&basemap=satellite`;

      // Check for validity of ICAO
      let airportDoesNotExistInMsfsHTML = undefined;
      if (nonExistingAirports.includes(icao)) {
        icaoElement.innerHTML = `<span style="text-decoration: line-through; color: #c00;">${icao}</span>
        <span style="
          position: relative;
          top: -2px;
        ">⚠️</span>`;
        airportDoesNotExistInMsfsHTML = `<div><div style="display: inline-block; width: 20px">⚠️</div> Warning: ICAO ${icao} does not exist in MSFS. Please use the coordinates from above to search the airport manually in MSFS.</div>`;
      }

      if (getCorrectedAirportForIcao(icao)) {
        const correctIcao = getCorrectedAirportForIcao(icao);
        icaoElement.innerHTML = `<span style="text-decoration: line-through; color: #c00;">${icao}</span>
        <span style="
          position: relative;
          padding: 0 3px;
        ">➡</span><span>${correctIcao}</span>`;
        airportDoesNotExistInMsfsHTML = `<div><div style="display: inline-block; width: 20px">⚠️</div> Warning: ICAO ${icao} does not exist in MSFS. In MSFS it's known as ${correctIcao}.</div>`;
      }

      elevationElement.insertAdjacentHTML(
        'afterend',
        `
    <div style="padding: 12px 0">
      <div>
        <a href="${googleMapsUrl}" target="_blank"><div style="display: inline-block; width: 20px">🌍</div> View on Google Maps</a>
      </div>
      <div onclick="navigator.clipboard.writeText('${coordsMsfs}'); alert('Copied ${coordsMsfs} to clipboard. You can use these to search for the airport in the World Map view of MSFS.');" style="cursor: pointer; display: inline-block;"><div style="display: inline-block; width: 20px">📄</div> Copy coordinates to clipboard for MSFS</div>
      ${airportDoesNotExistInMsfsHTML ? airportDoesNotExistInMsfsHTML : ''}
    </div>`,
      );
    }

    if (!icao && document.querySelector('.goodssearchTable')) {
      // Assume Search Results page
      console.log('Search Results page');

      const aircraftModelIdFromSearchForm = document.querySelector('[name="model"]');
      const airportWithSelectedAircraft = Array.from<HTMLAnchorElement>(
        document.querySelectorAll('.goodssearchTable a[href^="airport.jsp?icao"]'),
      ).map((el) => el.innerText);
    }
  }
};
