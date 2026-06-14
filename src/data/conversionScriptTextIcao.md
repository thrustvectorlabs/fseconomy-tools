# Conversion script for the ICAO/Text table on Wikipedia

Run the following in the console on https://en.wikipedia.org/wiki/List_of_aircraft_type_designators and copy the result of `console.log` with `Copy object`. The result should be usable for the `const aircraftListTextIcao` in `src/data/aircraftListTextIcao.ts`.

```
const nodes = document.querySelectorAll('.wikitable.sortable.jquery-tablesorter tbody tr');
const convertWikitableToJSON = (nodes) => {
  const aircraftListTextIcao = [];
  nodes.forEach((node) => {
    const text = node.querySelector('td:nth-child(3)')?.textContent?.trim() ?? '';
    const icao = node.querySelector('td:nth-child(1)')?.textContent?.trim() ?? '';
    aircraftListTextIcao.push({ text, icao });
  });
  return aircraftListTextIcao;
};
console.log(convertWikitableToJSON(nodes));
```
