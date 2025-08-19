import { correctedAirports } from '../data/airportMap';

export const getCorrectedAirportForIcao = (icao: string) => {
  const correctedAirport = correctedAirports.find((airport) => airport.icao === icao);
  return correctedAirport ? correctedAirport.actualIcao : null;
};
