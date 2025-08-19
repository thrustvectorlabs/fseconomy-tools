import { useMemo } from 'react';
import { Assignment } from '../../types/types';
import { useStore } from '../../store/store';
import { DataTable, Column } from '../data-table/data-table';

/**
 * The Assignment‑specific wrapper around the generic {@link DataTable} component.
 * It wires the table to the zustand store and defines column behaviour / rendering.
 */
export const AssignmentTable = () => {
  const assignments = useStore((state) => state.assignments);
  const getAircraftByRegistration = useStore((state) => state.getAircraftByRegistration);
  const getAirportByIcao = useStore((state) => state.getAirportByIcao);
  const setIsOpen = useStore((state) => state.setIsOpen);

  /**
   * Column definitions.  Wrapped in a `useMemo` because we pass stable render / accessor
   * functions that close over `getAirportByIcao` and `getAircraftByRegistration`.
   */
  const columns = useMemo<Column<Assignment>[]>(
    () => [
      {
        key: 'assignmentType',
        label: 'Type',
        sortable: true,
        filterable: true,
      },
      {
        key: 'origin',
        label: 'Origin',
        sortable: true,
        filterable: true,
        render: (row) => {
          const originAirport = getAirportByIcao(row.origin);
          const title = originAirport
            ? `${originAirport.name}, ${originAirport.city}, ${originAirport.country}`
            : undefined;
          return (
            <a href={`/airport.jsp?icao=${row.origin}`} title={title} onClick={() => setIsOpen(false)}>
              {row.origin}
            </a>
          );
        },
      },
      {
        key: 'destination',
        label: 'Destination',
        sortable: true,
        filterable: true,
        render: (row) => (
          <a href={`/airport.jsp?icao=${row.destination}`} onClick={() => setIsOpen(false)}>
            {row.destination}
          </a>
        ),
      },
      {
        key: 'distance',
        label: 'Distance',
        sortable: true,
        filterable: true,
      },
      {
        key: 'pay',
        label: 'Pay',
        sortable: true,
        filterable: true,
        render: (row) => row.pay.toFixed(2),
      },
      {
        key: 'payPerMile',
        label: 'Pay / Mile',
        sortable: true,
        render: (row) => (row.pay / row.distance).toFixed(2),
        sortAccessor: (row) => row.pay / row.distance,
      },
      {
        key: 'bearing',
        label: 'Bearing°',
        sortable: true,
        filterable: true,
      },
      {
        key: 'expires',
        label: 'Expires',
        sortable: true,
        filterable: true,
        render: (row) => row.expires,
      },
      {
        key: 'payload',
        label: 'Payload',
        sortable: true,
        filterable: true,
        render: (row) => (
          <span title={row.payloadString}>
            {row.payload} {row.payloadUnit}
          </span>
        ),
        filterValueAccessor: (row) => String(row.payloadString),
      },
      {
        key: 'aircraftRegistration',
        label: 'Reg.',
        sortable: true,
        filterable: true,
        render: (row) => row.aircraftRegistration ?? '—',
      },
      {
        key: 'aircraftType',
        label: 'Aircraft Type',
        sortable: true,
        render: (row) => (row.aircraftRegistration ? getAircraftByRegistration(row.aircraftRegistration)?.type : '-'),
        sortAccessor: (row) => {
          if (row.aircraftRegistration) {
            const type = getAircraftByRegistration(row.aircraftRegistration)?.type;
            return type ?? '';
          }
          return '';
        },
        filterable: true,
        filterValueAccessor: (row) =>
          row.aircraftRegistration ? (getAircraftByRegistration(row.aircraftRegistration)?.type ?? '') : '',
      },
    ],
    [getAirportByIcao, getAircraftByRegistration],
  );

  return (
    <DataTable
      rows={assignments}
      rowKey={(row) => row.assignmentId}
      columns={columns}
      className="assignment-table"
      initialSort={{ columnKey: 'expires', direction: 'asc' }}
    />
  );
};
