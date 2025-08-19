import { fetchDataFromAirport } from '../../fetchers/fetchDataFromAirport';
import { fetchAirportListWithAircraftType } from '../../fetchers/fetchAirportListWithAircraftType';
import { useStore } from '../../store/store';
import { config } from '../../config';
import { getAircraftNameById } from '../../utils/getAircraft';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';

export const SearchPage = () => {
  const clearAssignmentsAndAircraft = useStore((state) => state.clearAssignmentsAndAircraft);
  const setSearchFormParameters = useStore((state) => state.setSearchFormParameters);

  const onClickGetAllAircraftWithForm = async () => {
    const aircraftModelId = parseInt((document.querySelector('[name="fse_tools_model"]') as HTMLInputElement).value);
    const distance = parseInt((document.querySelector('[name="fse_tools_distance"]') as HTMLInputElement).value);
    const distanceBonus = parseInt(
      (document.querySelector('[name="fse_tools_distance_bonus"]') as HTMLInputElement).value,
    );
    const icao = (document.querySelector('[name="fse_tools_from_airport"]') as HTMLInputElement).value;
    const icaoOverride = (document.querySelector('[name="fse_tools_from_airport_override"]') as HTMLInputElement).value;

    setSearchFormParameters({
      aircraftModelId,
      departureAirport: icao,
      departureAirportOverride: icaoOverride,
      radius: distance,
      maxDistanceBonus: distanceBonus,
    });

    if (!config.developmentMode) {
      clearAssignmentsAndAircraft();
    }

    const airportsWithAircraft = await fetchAirportListWithAircraftType(
      aircraftModelId,
      icaoOverride || icao,
      distance,
    );

    if (Array.isArray(airportsWithAircraft)) {
      await Promise.all(
        airportsWithAircraft.map(async (airportsWithAircraft) => {
          const airportData = await fetchDataFromAirport(airportsWithAircraft.icao, aircraftModelId);
          return airportData;
        }),
      );
    }
  };

  return (
    <>
      <Breadcrumbs />
      <form>
        {/* Aircraft */}
        <label htmlFor="fse_tools_model">Aircraft Type</label>
        <select id="fse_tools_model" name="fse_tools_model">
          {config.aircraftToSelect.map((aircraftSelection) => (
            <option key={aircraftSelection.modelId} value={aircraftSelection.modelId}>
              {getAircraftNameById(aircraftSelection.modelId)}
            </option>
          ))}
        </select>

        {/* Airports */}
        <label htmlFor="fse_tools_from_airport">Departure Airport</label>
        <select id="fse_tools_from_airport" name="fse_tools_from_airport">
          {config.airportsToSelect.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>

        {/* Override */}
        <label htmlFor="fse_tools_from_airport_override">Custom</label>
        <input
          id="fse_tools_from_airport_override"
          name="fse_tools_from_airport_override"
          type="text"
          placeholder="Airport code"
        />

        {/* Distance */}
        <label htmlFor="fse_tools_distance">Radius</label>
        <select id="fse_tools_distance" name="fse_tools_distance">
          {[10, 50, 100, 250, 500, 750, 1000, 1250, 1500].map((distance) => (
            <option key={distance} value={distance}>
              {distance} NM
            </option>
          ))}
        </select>

        {/* Distance Bonus */}
        <label htmlFor="fse_tools_distance_bonus">Max. Distance Bonus</label>
        <select id="fse_tools_distance_bonus" name="fse_tools_distance_bonus">
          {[0, 25, 50, 75, 100, 200, 300, 400, 500, 1000, 10000].map((distanceBonus) => (
            <option key={distanceBonus} value={distanceBonus}>
              ${distanceBonus}
            </option>
          ))}
        </select>

        <button
          name="fse_tools_search"
          type="button"
          className="fset-button search-button"
          onClick={() => onClickGetAllAircraftWithForm()}
        >
          Search aircraft
        </button>
        {config.developmentMode && (
          <button type="button" className="fset-button search-button" onClick={() => clearAssignmentsAndAircraft()}>
            Clear store
          </button>
        )}
      </form>
    </>
  );
};
