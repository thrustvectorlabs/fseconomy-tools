export const extractTableCellValuesFromRow = (row: HTMLElement) => {
  return Array.from(row.querySelectorAll('td')).map((cell) => cell.innerText.trim());
};
