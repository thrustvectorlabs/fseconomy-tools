import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { Assignment } from '../../types/types';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { DataTable, Column } from '../data-table/data-table';

interface AirportSummary {
  airport: string;
  destination: string;
  totalPay: number;
  passengerCount: number;
  assignments: Assignment[];
}

export const ConsolidatedPage = () => {
  const [desiredPassengers, setDesiredPassengers] = useState<number>(8);
  const [maxDistance, setMaxDistance] = useState<string>('');
  const [assignmentTypeFilter, setAssignmentTypeFilter] = useState<string>('All');
  const setIsOpen = useStore((state) => state.setIsOpen);

  const calculateAirportSummaries = (assignments: Assignment[], desiredPassengerCapacity: number): AirportSummary[] => {
    const uniqueAirports = [...new Set(assignments.map((a) => a.origin))];

    const allSummaries = uniqueAirports.map((airport) => {
      const perPaxAssignments = assignments.filter(
        (assignment) => assignment.origin === airport && assignment.payloadUnit === 'pax'
      );

      const uniqueDestinations = [...new Set(perPaxAssignments.map((a) => a.destination))];

      return uniqueDestinations.reduce(
        (currentBest, destination) => {
          const destAssignments = perPaxAssignments
            .filter((a) => a.destination === destination)
            .sort((a, b) => b.pay - a.pay);

          let accumulatedPassengers = 0;
          const selected: Assignment[] = [];
          for (const candidate of destAssignments) {
            if (accumulatedPassengers >= desiredPassengerCapacity) break;
            selected.push(candidate);
            accumulatedPassengers += candidate.payload;
          }

          const groupPay = selected.reduce((sum, a) => sum + a.pay, 0);

          if (groupPay > currentBest.totalPay) {
            return {
              airport,
              destination,
              totalPay: groupPay,
              passengerCount: accumulatedPassengers,
              assignments: selected,
            };
          }
          return currentBest;
        },
        {
          airport,
          destination: '',
          totalPay: 0,
          passengerCount: 0,
          assignments: [] as Assignment[],
        }
      );
    });

    return allSummaries.filter((s) => s.passengerCount <= desiredPassengerCapacity);
  };

  const allAssignments = useStore().assignments;
  // filter by distance and type
  const filteredAssignments = allAssignments
    .filter((a) => (maxDistance ? a.distance <= Number(maxDistance) : true))
    .filter((a) => (assignmentTypeFilter === 'All' ? true : a.assignmentType === assignmentTypeFilter));

  const airportSummaries = calculateAirportSummaries(filteredAssignments, desiredPassengers);

  const columns: Column<AirportSummary>[] = [
    {
      key: 'airport',
      label: 'Origin Airport',
      sortable: true,
      render: (row) => (
        <a href={`/airport.jsp?icao=${row.airport}`} onClick={() => setIsOpen(false)}>
          {row.airport}
        </a>
      ),
    },
    {
      key: 'destination',
      label: 'Destination',
      sortable: true,
      render: (row) => (
        <a href={`/airport.jsp?icao=${row.destination}`} onClick={() => setIsOpen(false)}>
          {row.destination}
        </a>
      ),
    },
    {
      key: 'assignmentType',
      label: 'Type',
      sortable: true,
      sortAccessor: (row) => (row.assignments.length ? row.assignments[0].assignmentType : ''),
      render: (row) => (row.assignments.length ? row.assignments[0].assignmentType : '—'),
    },
    {
      key: 'passengerCount',
      label: 'Passengers',
      sortable: true,
      sortAccessor: (row) => row.passengerCount,
    },
    {
      key: 'totalPay',
      label: 'Total Pay',
      sortable: true,
      sortAccessor: (row) => row.totalPay,
    },
    {
      key: 'distance',
      label: 'Distance',
      sortable: true,
      sortAccessor: (row) => (row.assignments.length ? row.assignments[0].distance : 0),
      render: (row) => (row.assignments.length ? row.assignments[0].distance.toFixed(0) : '—'),
    },
    {
      key: 'payPerMile',
      label: 'Pay / Mile',
      sortable: true,
      sortAccessor: (row) => (row.assignments.length ? row.totalPay / row.assignments[0].distance : 0),
      render: (row) => (row.assignments.length ? (row.totalPay / row.assignments[0].distance).toFixed(2) : '—'),
    },
    {
      key: 'details',
      label: 'Assignments',
      render: (row) => (
        <ul title={row.assignments.map((a) => a.payloadString).join(', ')}>
          {row.assignments.map((a) => (
            <li key={a.assignmentId}>{`${a.payloadString} (${a.assignmentType}) → $${a.pay}`}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { pageName: 'Search', pageId: 'search' },
          { pageName: 'Consolidated', pageId: 'consolidated' },
        ]}
      />
      <div className="assignments">
        <div className="consolidated-filters">
          <div className="consolidated-filters__group">
            <label htmlFor="maxPassengers" className="consolidated-filters__label">
              Max Passengers
            </label>
            <select
              id="maxPassengers"
              value={desiredPassengers}
              onChange={(e) => setDesiredPassengers(Number(e.target.value))}
            >
              {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="consolidated-filters__group">
            <label htmlFor="maxDistance" className="consolidated-filters__label">
              Max Distance (km)
            </label>
            <input
              id="maxDistance"
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              placeholder="e.g. 250"
            />
          </div>

          <div className="consolidated-filters__group">
            <label htmlFor="assignmentTypeFilter" className="consolidated-filters__label">
              Type
            </label>
            <select
              id="assignmentTypeFilter"
              value={assignmentTypeFilter}
              onChange={(e) => setAssignmentTypeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="T">T</option>
              <option value="A">A</option>
              <option value="V">V</option>
            </select>
          </div>
        </div>

        <DataTable
          rows={airportSummaries}
          columns={columns}
          rowKey={(row) => `${row.airport}-${row.destination}`}
          initialSort={{ columnKey: 'totalPay', direction: 'desc' }}
          className="mt-4"
        />
      </div>
    </>
  );
};
