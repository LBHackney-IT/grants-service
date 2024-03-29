import { useEffect } from 'react';
import Router from 'next/router';
import { useTable, useSortBy, usePagination } from 'react-table';
import { getQueryParametersAsObject } from '../ApplicationsList/ApplicationsList.jsx';

const recordFrom = (pageIndex, pageSize) =>
  pageIndex * pageSize == 0 ? 1 : pageIndex * pageSize + 1;

const Table = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  initialPage = 1,
  initialPageSize = 10,
  initialSortBy,
  totalRecords = 0,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: parseInt(initialPage - 1, 10),
        pageSize: parseInt(initialPageSize, 10),
        sortBy: initialSortBy && [
          { id: initialSortBy.slice(1), desc: initialSortBy[0] === '-' },
        ],
      },
      manualSortBy: true,
      manualPagination: true,
      pageCount: controlledPageCount,
      disableMultiSort: true,
    },
    useSortBy,
    usePagination
  );
  useEffect(() => {
    fetchData({ pageIndex, pageSize, sortBy: sortBy[0] });
  }, [pageIndex, pageSize, sortBy[0]]);
  return (
    <>
      <table className="govuk-table" {...getTableProps()}>
        <thead className="govuk-table__head">
          {headerGroups.map((headerGroup) => (
            <tr
              className="govuk-table__row"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  scope="col"
                  className="govuk-table__header"
                  {...column.getHeaderProps()}
                >
                  <span {...column.getSortByToggleProps()}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="govuk-table__body" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const queryParameters = getQueryParametersAsObject();
            return (
              <tr
                data-testid="table-row"
                className="govuk-table__row lbh-table__row--data"
                {...row.getRowProps()}
                onClick={() =>
                  Router.push({
                    pathname:
                      '/admin/grant/[grantType]/applications/[clientGeneratedId]',
                    query: {
                      clientGeneratedId: row.original.clientGeneratedId,
                      ...queryParameters,
                    },
                  })
                }
              >
                {row.cells.map((cell) => {
                  return (
                    <td className="govuk-table__cell" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="govuk-table__row">
            {loading ? (
              <td className="govuk-table__cell" colSpan="10000">
                Loading...
              </td>
            ) : (
              <td className="govuk-table__cell" colSpan="10000">
                {data.length == 0 ? (
                  <>No results</>
                ) : (
                  <>
                    Showing {recordFrom(pageIndex, pageSize)} to{' '}
                    {recordFrom(pageIndex, pageSize) + data.length - 1} of{' '}
                    {totalRecords}{' '}
                  </>
                )}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;
