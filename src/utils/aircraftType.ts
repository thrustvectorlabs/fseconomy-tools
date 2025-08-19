import { aircraftListTextIcao } from '../data/aircraftListTextIcao';
import { aircraftListTextIcaoOverrides } from '../data/aircraftListTextIcaoOverrides';

export const getAircraftTypeFromModelText = (aircraftModelText: string) => {
  const preparedAircraftModelText = aircraftModelText.replace('(MSFS)', '').trim();

  const overrideMatch = aircraftListTextIcaoOverrides.find((aircraftTextIcao) => {
    return aircraftTextIcao.text === preparedAircraftModelText;
  });

  if (overrideMatch) {
    return overrideMatch.icao;
  }

  const match = aircraftListTextIcao.find((aircraftTextIcao) => {
    return aircraftTextIcao.text === preparedAircraftModelText;
  });

  if (match) {
    return match.icao;
  }

  return null;
};
