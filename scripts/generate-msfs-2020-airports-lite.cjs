const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'src', 'data', 'msfs-2020-airports.json');
const targetPath = path.join(__dirname, '..', 'src', 'data', 'msfs-2020-airports-lite.json');

const airports = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const liteAirports = airports.map((airport) => [
  airport.ident,
  Number(airport.laty.toFixed(6)),
  Number(airport.lonx.toFixed(6)),
]);

fs.writeFileSync(targetPath, JSON.stringify(liteAirports));

console.log(`Wrote ${liteAirports.length} airports to ${path.relative(process.cwd(), targetPath)}`);
