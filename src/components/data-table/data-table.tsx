import { useMemo, useState } from 'react';

/**
 * Column configuration object describing how a single column should behave and render.
 */
export interface Column<RowType extends object> {
  /** Property key on the row or a synthetic column key. */
  key: keyof RowType | string;
  /** Column heading shown to the user. */
  label: string;
  /** Whether the column can be sorted. */
  sortable?: boolean;
  /** Whether the column shows a text‑input filter. */
  filterable?: boolean;
  /** Custom cell renderer. */
  render?: (row: RowType) => React.ReactNode;
  /** Derive sortable value from the row. */
  sortAccessor?: (row: RowType) => number | string;
  /** Derive filterable text from the row. */
  filterValueAccessor?: (row: RowType) => string;
}

/**
 * Props supplied to the {@link DataTable} component.
 */
export interface DataTableProps<RowType extends object> {
  /** Array of data rows that will populate the table. */
  rows: RowType[];
  /** Column definitions describing how to display each column. */
  columns: Column<RowType>[];
  /** Function returning a stable, unique key for a given row. */
  rowKey: (row: RowType) => React.Key;
  /** Optional initial sort state applied on first render. */
  initialSort?: {
    columnKey: string;
    direction: 'asc' | 'desc';
  } | null;
  /** Optional CSS className forwarded to the table wrapper `<div>`. */
  className?: string;
}

/** Internal sort‑state type plumbing. */
type SortState = {
  columnKey: string;
  direction: 'asc' | 'desc';
} | null;

/**
 * A fully client‑side, reusable data table with column‑level sorting and filtering.
 */
export const DataTable = <RowType extends object>({
  rows,
  columns,
  rowKey,
  initialSort = null,
  className,
}: DataTableProps<RowType>) => {
  // ---- State ------------------------------------------------------------
  const [sortState, setSortState] = useState<SortState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // ---- Event handlers ---------------------------------------------------
  const handleSort = (columnKey: string): void => {
    setSortState((current) => {
      if (current?.columnKey === columnKey) {
        return {
          columnKey,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { columnKey, direction: 'asc' };
    });
  };

  const handleFilterChange = (columnKey: string, filterValue: string): void => {
    setColumnFilters((previous) => ({
      ...previous,
      [columnKey]: filterValue,
    }));
  };

  const handleReset = (): void => {
    setSortState(initialSort ?? null);
    setColumnFilters({});
  };

  // ---- Derived rows: filtering ➜ sorting -------------------------------
  const displayedRows = useMemo((): RowType[] => {
    let filteredRows = [...rows];

    // 1️⃣ Filter rows per active column filter input.
    filteredRows = filteredRows.filter((row) =>
      columns.every(({ key, filterable, filterValueAccessor }) => {
        if (!filterable) return true;
        const filterText = columnFilters[String(key)];
        if (!filterText) return true;

        const rawCellValue = filterValueAccessor
          ? filterValueAccessor(row)
          : String((row as any)[key as keyof RowType] ?? '');

        return rawCellValue.toLowerCase().includes(filterText.toLowerCase());
      }),
    );

    // 2️⃣ Sort rows if requested.
    if (sortState) {
      const { columnKey, direction } = sortState;
      const sortColumn = columns.find((column) => String(column.key) === columnKey);

      if (sortColumn) {
        filteredRows.sort((a: RowType, b: RowType) => {
          const aValue = sortColumn.sortAccessor ? sortColumn.sortAccessor(a) : (a as any)[columnKey];
          const bValue = sortColumn.sortAccessor ? sortColumn.sortAccessor(b) : (b as any)[columnKey];

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
          }
          return direction === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        });
      }
    }

    return filteredRows;
  }, [rows, columns, columnFilters, sortState]);

  // ---- Render -----------------------------------------------------------
  return (
    <div id="data-table-container" className={className}>
      {/* Toolbar --------------------------------------------------------- */}
      <div className="data-table-filters">
        <button type="button" onClick={handleReset} className="fset-button">
          Reset filters and sorting
        </button>
      </div>

      {/* Table ----------------------------------------------------------- */}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
                style={{ cursor: column.sortable ? 'pointer' : 'default', userSelect: 'none' }}
              >
                {column.label}
                {sortState?.columnKey === String(column.key) && (sortState.direction === 'asc' ? ' 🔼' : ' 🔽')}

                {column.filterable && (
                  <div>
                    <input
                      type="text"
                      placeholder={`Filter`}
                      value={columnFilters[String(column.key)] ?? ''}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => handleFilterChange(String(column.key), event.currentTarget.value)}
                      style={{ width: '70px', padding: '3px' }}
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayedRows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={String(column.key)}>
                  {column.render ? column.render(row) : String((row as any)[column.key as keyof RowType] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
