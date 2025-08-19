interface FboListing {
  name: string;
  icao: string;
  location: string;
  country: string;
  price: number;
  size?: string;
}

export const enhanceFbosForSale = () => {
  // Modifiers
  if (window.location.href.split('?')[0].indexOf('fbosforsale.jsp') !== -1) {
    const fboTableElement: HTMLElement | null = document.querySelector('#wrapper table.fboTable');
    const fboListingRows = document.querySelectorAll('#wrapper > div > div.dataTable > form > table > tbody > tr');

    const listings: FboListing[] = Array.from(fboListingRows).map((row) => {
      const columns = row.querySelectorAll('td');
      const name = columns[0].innerText;
      const icao = columns[1].innerText;
      const location = columns[2].innerText;
      const country = columns[3].innerText;
      const price = parseInt(columns[4].innerText.replace('$', '').replaceAll(',', '').replace('.00', ''));

      const airportImageUrl = (columns[1].querySelector('a img') as HTMLImageElement).src;

      const listing: FboListing = {
        name,
        icao,
        location,
        country,
        price,
      };

      const sizeMap: Record<string, string> = {
        'https://server.fseconomy.net/img/airstrip-fbo.gif': 'airstrip',
        'https://server.fseconomy.net/img/small-airport-fbo.gif': 'small',
        'https://server.fseconomy.net/img/large-airport-fbo.gif': 'large',
        'https://server.fseconomy.net/img/seaplane-fbo.gif': 'seaplane',
        'https://server.fseconomy.net/img/military-fbo.gif': 'military',
      };
      listing.size = sizeMap[airportImageUrl] || 'unknown';

      return listing;
    });

    const fbosInTheNetherlands = listings.filter((listing) => listing.icao.startsWith('EH'));
    const fbosUnderAMillion = listings.filter((listing) => listing.price < 1000000);
    const largeFbosUnderAMillion = listings.filter((listing) => listing.price < 1000000 && listing.size === 'large');
    const largeFbosOverAMillion = listings.filter((listing) => listing.price > 1000000 && listing.size === 'large');
    const fbosWithUnknownSize = listings.filter((listing) => listing.size === 'unknown');
    let fboListingComparison = null;

    // Sort listings by icao
    listings.sort((a, b) => (a.icao > b.icao ? 1 : -1));

    // Use slot fbosforsale for comparison.
    // if (localStorage.getItem('fbosforsale')) {
    //   const fbosforsale: FboListing[] = JSON.parse(localStorage.getItem('fbosforsale'));
    //   // Compare to current
    //   if (JSON.stringify(fbosforsale) === JSON.stringify(listings)) {
    //     console.log('EQUAL STORAGE');
    //   } else {
    //     // Compare to previous
    //     console.log('NOT EQUAL STORAGE: COMPARING');

    //     // Compare fbosforsale from localStore with current listings
    //     const localStorageToListingsComparison = fbosforsale.filter((fboListing) => {
    //       const match = listings.find((listing) => listing.icao === fboListing.icao);
    //       if (!match) {
    //         console.log(`NOT FOUND IN LISTING (FBO SOLD): ${fboListing.icao}`);
    //         return true;
    //       }
    //       return false;
    //     });

    //     const listingsToLocalStorageComparison = listings.filter((fboListing) => {
    //       const match = fbosforsale.find((listing) => listing.icao === fboListing.icao);
    //       if (!match) {
    //         console.log(`NOT FOUND IN LOCAL STORAGE (FBO NOW FOR SALE): ${fboListing.icao}`);
    //         return true;
    //       }
    //       return false;
    //     });
    //     console.log('Comparisons:');
    //     console.log(localStorageToListingsComparison);
    //     console.log(listingsToLocalStorageComparison);

    //     // Create rows for overview of localStorageToListingsComparison using interface localStorageToListingsComparison

    //     const fboTableHeaders = `<tr class="tablesorter-headerRow" role="row">
    //         <th><div class="tablesorter-header-inner">Name</div></th>
    //         <th><div class="tablesorter-header-inner">ICAO</div></th>
    //         <th><div class="tablesorter-header-inner">Location</div></th>
    //         <th><div class="tablesorter-header-inner">Country</div></th>
    //         <th><div class="tablesorter-header-inner">Price</div></th>
    //         <th><div class="tablesorter-header-inner">Size</div></th>
    //     </tr>`;

    //     const newForSaleFbos = listingsToLocalStorageComparison.map((fbo) => {
    //       return `<tr>
    //         <td>${fbo.name}</td>
    //         <td>${fbo.icao}</td>
    //         <td>${fbo.location}</td>
    //         <td>${fbo.country}</td>
    //         <td>${fbo.price}</td>
    //         <td>${fbo.size}</td>
    //       </tr>`;
    //     });

    //     const soldFbos = localStorageToListingsComparison.map((fbo) => {
    //       return `<tr>
    //         <td>${fbo.name}</td>
    //         <td>${fbo.icao}</td>
    //         <td>${fbo.location}</td>
    //         <td>${fbo.country}</td>
    //         <td>${fbo.price}</td>
    //         <td>${fbo.size}</td>
    //       </tr>`;
    //     });

    //     fboTableElement.insertAdjacentHTML(
    //       'beforebegin',
    //       `
    //       <table style="margin: 12px 0 24px 0; width: 1200px;">
    //         <caption>New FBO's for sale</caption>
    //         ${fboTableHeaders}
    //         ${newForSaleFbos}
    //       </table>`
    //     );

    //     fboTableElement.insertAdjacentHTML(
    //       'beforebegin',
    //       `
    //       <table style="margin: 12px 0 24px 0; width: 1200px;">
    //         <caption>Sold FBO's</caption>
    //         ${fboTableHeaders}
    //         ${soldFbos}
    //       </table>`
    //     );
    //   }
    // } else {
    //   console.log('localStorage: item not found. Writing to localStorage.');
    //   localStorage.setItem('fbosforsale', JSON.stringify(listings));
    // }

    // localStorage.setItem('fbosforsale', JSON.stringify(listings));

    if (fboTableElement) {
      fboTableElement.insertAdjacentHTML(
        'beforebegin',
        `
      <table style="margin: 12px 0 24px 0; width: 500px;">
        <caption>Summary: FBO's for sale</caption>
          <tr>
            <td>FBO's for sale:</td>
            <td>${listings.length}</td>
          </tr>
          <tr>
            <td>FBO's in the Netherlands:</td>
            <td>${fbosInTheNetherlands.length}</td>
          </tr>
          <tr>
            <td>FBO's under a million:</td>
            <td>${fbosUnderAMillion.length}</td>
          </tr>
          <tr>
            <td>Large FBO's under a million:</td>
            <td>${largeFbosUnderAMillion.length}</td>
          </tr>
          <tr>
            <td>Large FBO's over a million:</td>
            <td>${largeFbosOverAMillion.length}</td>
          </tr>
          <tr>
            <td>FBO's with unknown size:</td>
            <td>${fbosWithUnknownSize.length}</td>
          </tr>
        </table>
      `,
      );
    }
  }
};
