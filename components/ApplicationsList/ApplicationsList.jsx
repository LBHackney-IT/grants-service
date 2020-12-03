import { useState, useEffect, useMemo, useCallback } from 'react';
import Router from 'next/router';

import Table from 'components/Table/Table';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { BasicSelect, TextInput } from 'components/Form';
import { fetchApplications, patchApplications } from 'utils/api/applications';

import { APPLICATION_STATE, BUSINESS_CATEGORIES } from 'lib/dbMapping';
import { fetchGrantOfficers } from '../../utils/api/grantOfficers';

const ApplicationsList = ({
  page,
  pageSize,
  sort,
  status,
  grantOfficer,
  businessCategory,
  businessSubcategory,
  applicationId,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Business Name',
        accessor: 'businessName',
      },
      {
        Header: 'Application Id',
        accessor: 'clientGeneratedId',
        disableSortBy: true,
      },
      {
        Header: 'Submission',
        accessor: 'applicationDate',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableSortBy: true,
      },
    ],
    []
  );
  const [filters, setFilters] = useState({
    status,
    grantOfficer,
    applicationId,
    businessCategory,
    businessSubcategory,
  });
  const [error, setError] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [officers, setOfficers] = useState([]);
  const checkFilter = JSON.stringify(filters);
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setError(null);
        const data = await fetchGrantOfficers();
        setOfficers(data.grantOfficers.map(({ identifier }) => identifier));
      } catch (e) {
        setError(e.response.data);
        setOfficers(null);
      }
    };
    fetchOfficers();
  }, []);
  useEffect(() => {
    fetchData(filters);
  }, [checkFilter]);
  const setValues = useCallback((state) =>
    setFilters({ ...filters, ...state })
  );
  const fetchData = useCallback(
    async ({ pageSize, pageIndex, sortBy, ...otherFilters }) => {
      if (isNaN(pageSize)) {
        return;
      }
      setLoading(true);
      const query = {
        page: pageIndex + 1,
        pageSize,
        sort: sortBy && `${sortBy.desc ? '-' : '+'}${sortBy.id}`,
        ...otherFilters,
      };
      Router.push(
        '/admin',
        {
          pathname: '/admin',
          query,
        },
        { shallow: true }
      );
      try {
        setError(null);
        const { applications, pagination } = await fetchApplications(query);
        setData(applications);
        setPageCount(pagination.totalPages);
        setLoading(false);
      } catch (e) {
        e.response.status === 400
          ? setValues({ pageIndex: 0, pageSize, sortBy, ...otherFilters })
          : setError(e.response.data);
      }
    },
    []
  );
  const handleCsvDownload = async ({ grant_type }) => {
    try {
      setError(null);
      const csv = await patchApplications({
        grant_type: grant_type,
      });
      window.open(encodeURI(`data:text/csv;charset=utf-8,${csv}`));
    } catch (e) {
      e.response.status = 400;
      setError(e.response.data);
    }
  };
  return !error ? (
    <>
      <BasicSelect
        options={APPLICATION_STATE}
        label="Filter by Status:"
        value={filters.status}
        onChange={(status) => setValues({ status })}
      />

      {officers && (
        <BasicSelect
          options={officers}
          label="Filter by Grant Officer:"
          value={filters.grantOfficer}
          onChange={(grantOfficer) => setValues({ grantOfficer })}
        />
      )}

      <BasicSelect
        options={Object.keys(BUSINESS_CATEGORIES)}
        label="Filter by Business Category:"
        value={filters.businessCategory}
        onChange={(businessCategory) => setValues({ businessCategory })}
      />

      {filters.businessCategory && (
        <BasicSelect
          options={BUSINESS_CATEGORIES[filters.businessCategory]}
          label="Filter by Business Subcategory:"
          value={filters.businessSubcategory}
          onChange={(businessSubcategory) => setValues({ businessSubcategory })}
        />
      )}

      <TextInput
        label="Search by Application ID"
        value={filters.applicationId}
        onChange={(applicationIdEvent) => {
          setValues({ applicationId: applicationIdEvent.target.value });
        }}
      />
      <Table
        columns={columns}
        data={data}
        fetchData={setValues}
        loading={loading}
        pageCount={pageCount}
        initialPage={page}
        initialPageSize={pageSize}
        initialSortBy={sort ? sort : '+applicationDate'}
      />
      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
      <p>
        <a href="/api/csv/applications" target="_blank">
          Download Applications CSV
        </a>
      </p>
      <p>
        <a
          href="#"
          onClick={() =>
            handleCsvDownload({ grant_type: 'lrsg_closed_businesses' })
          }
        >
          Export LSRG (Closed) Panel Approved Payments
        </a>
      </p>
      <p>
        <a
          href="#"
          onClick={() => handleCsvDownload({ grant_type: 'lrsg_sector' })}
        >
          Export LSRG (Sector) Panel Approved Payments
        </a>
      </p>
      <p>
        <a
          href="#"
          onClick={() => handleCsvDownload({ grant_type: 'lrsg_open' })}
        >
          Export LSRG (Open) Panel Approved Payments
        </a>
      </p>
    </>
  ) : (
    <ErrorMessage text={error} />
  );
};

export default ApplicationsList;
