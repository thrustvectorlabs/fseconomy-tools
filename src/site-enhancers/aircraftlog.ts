export const enhanceAircraftLog = () => {
  // Modifiers
  if (window.location.href.split('?')[0].indexOf('aircraftlog.jsp') !== -1) {
    const aircraftCurrentLocationIcaoElement: HTMLElement | null = document.querySelector(
      '#wrapper > div > div:nth-child(1) > form > table:nth-child(5) > tbody > tr > td:nth-child(5)',
    );
    const aircraftHomeIcaoElement: HTMLElement | null = document.querySelector(
      '#wrapper > div > div:nth-child(1) > form > table:nth-child(5) > tbody > tr > td:nth-child(4)',
    );

    if (!aircraftCurrentLocationIcaoElement || !aircraftHomeIcaoElement) {
      console.warn('One or more required elements are missing on the page.');
      return;
    }

    const currentLocationLink = `<a href="https://server.fseconomy.net/airport.jsp?icao=${aircraftCurrentLocationIcaoElement.innerText}">${aircraftCurrentLocationIcaoElement.innerText}</a>`;
    const aircraftHomeIcaoLink = `<a href="https://server.fseconomy.net/airport.jsp?icao=${aircraftHomeIcaoElement.innerText}">${aircraftHomeIcaoElement.innerText}</a>`;

    aircraftCurrentLocationIcaoElement.innerHTML = currentLocationLink;
    aircraftHomeIcaoElement.innerHTML = aircraftHomeIcaoLink;
  }
};
