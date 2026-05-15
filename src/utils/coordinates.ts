export interface ParsedAirportCoordinates {
  latitude: number;
  longitude: number;
  msfs: string;
  googleMapsCenter: string;
}

const coordinatePattern = /Lat:\s*([0-9.]+)\s*([NS])\s*,?\s*Long:\s*([0-9.]+)\s*([EW])/i;

export const parseAirportCoordinates = (value: string): ParsedAirportCoordinates | null => {
  const matches = value.match(coordinatePattern);

  if (!matches) {
    return null;
  }

  const latitude = Number.parseFloat(matches[1]) * (matches[2].toUpperCase() === 'N' ? 1 : -1);
  const longitude = Number.parseFloat(matches[3]) * (matches[4].toUpperCase() === 'E' ? 1 : -1);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
    msfs: `${matches[1]}${matches[2].toUpperCase()}, ${matches[3]}${matches[4].toUpperCase()}`,
    googleMapsCenter: `${latitude}%2C${longitude}`,
  };
};
