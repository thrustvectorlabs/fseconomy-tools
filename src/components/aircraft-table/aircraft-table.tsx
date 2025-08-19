import { useMemo } from 'react';
import { Aircraft } from '../../types/types';
import { useStore } from '../../store/store';
import { DataTable, Column } from '../data-table/data-table';

/**
 * Wrapper for displaying aircraft data in a generic DataTable.
 */
export const AircraftTable = () => {
  const aircraftList = useStore((state) => state.aircraft);
  const getAirportByIcao = useStore((state) => state.getAirportByIcao);
  const setIsOpen = useStore((state) => state.setIsOpen);

  const columns = useMemo<Column<Aircraft>[]>(
    () => [
      {
        key: 'registration',
        label: 'Registration',
        sortable: true,
        filterable: true,
      },
      {
        key: 'type',
        label: 'Type',
        sortable: true,
        filterable: true,
      },
      {
        key: 'stationedAtIcao',
        label: 'Stationed At',
        sortable: true,
        filterable: true,
        render: (row) => {
          const airport = getAirportByIcao(row.stationedAtIcao);
          const title = airport ? `${airport.name}, ${airport.city}, ${airport.country}` : undefined;
          return (
            <a href={`/airport.jsp?icao=${row.stationedAtIcao}`} title={title} onClick={() => setIsOpen(false)}>
              {row.stationedAtIcao}
            </a>
          );
        },
        filterValueAccessor: (row) => row.stationedAtIcao,
      },
      {
        key: 'homeIcao',
        label: 'Home Base',
        sortable: true,
        filterable: true,
        render: (row) => {
          const airport = getAirportByIcao(row.homeIcao);
          const title = airport ? `${airport.name}, ${airport.city}, ${airport.country}` : undefined;
          return (
            <a href={`/airport.jsp?icao=${row.homeIcao}`} title={title} onClick={() => setIsOpen(false)}>
              {row.homeIcao}
            </a>
          );
        },
        filterValueAccessor: (row) => row.homeIcao,
      },
      {
        key: 'rentalPriceDry',
        label: 'Rental Price (Dry)',
        sortable: true,
        filterable: true,
        render: (row) => (row.rentalPriceDry != null ? `\$${row.rentalPriceDry.toFixed(2)}` : '—'),
        filterValueAccessor: (row) => (row.rentalPriceDry != null ? String(row.rentalPriceDry) : ''),
      },
      {
        key: 'rentalPriceWet',
        label: 'Rental Price (Wet)',
        sortable: true,
        filterable: true,
        render: (row) => (row.rentalPriceWet != null ? `\$${row.rentalPriceWet.toFixed(2)}` : '—'),
        filterValueAccessor: (row) => (row.rentalPriceWet != null ? String(row.rentalPriceWet) : ''),
      },
      {
        key: 'distanceBonus',
        label: 'Distance Bonus',
        sortable: true,
        filterable: true,
      },
      {
        key: 'isRentableDry',
        label: 'Rentable Dry',
        sortable: true,
        filterable: true,
        render: (row) => (row.isRentableDry ? '✓' : '✗'),
        filterValueAccessor: (row) => String(row.isRentableDry),
      },
      {
        key: 'isRentableWet',
        label: 'Rentable Wet',
        sortable: true,
        filterable: true,
        render: (row) => (row.isRentableWet ? '✓' : '✗'),
        filterValueAccessor: (row) => String(row.isRentableWet),
      },
      {
        key: 'needsRepair',
        label: 'Needs Repair',
        sortable: true,
        filterable: true,
        render: (row) => (row.needsRepair ? '✓' : '✗'),
        filterValueAccessor: (row) => String(row.needsRepair),
      },
    ],
    [getAirportByIcao],
  );

  return (
    <DataTable
      rows={aircraftList}
      rowKey={(row) => row.registration}
      columns={columns}
      className="aircraft-table"
      initialSort={{ columnKey: 'registration', direction: 'asc' }}
    />
  );
};
