import { useState, useEffect, useMemo, useCallback } from 'react';
import Router, { useRouter } from 'next/router';

import Table from '../Table/Table';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { BasicSelect, TextInput } from '../Form';
import {
  fetchApplications,
  patchApplications,
} from '../../utils/api/applications';

import {
  APPLICATION_STATE,
  BUSINESS_CATEGORIES,
  BUSINESS_SIZE,
  DATES,
  TYPE_OF_BUSINESS,
} from '../../lib/dbMapping';
import { fetchGrantOfficers } from '../../utils/api/grantOfficers';

const ApplicationsList = ({
  grantType,
  page,
  pageSize,
  sort,
  status,
  grantOfficer,
  businessCategory,
  businessSize,
  businessPremises,
  applicationId,
  searchTerm,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Business Name',
        accessor: 'businessName',
      },
      {
        Header: 'Application ID',
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
    businessSize,
    businessPremises,
    searchTerm,
  });
  const [error, setError] = useState();
  const [searchTermInput, setSearchTermInput] = useState(searchTerm);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [officers, setOfficers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

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
  }, [filters]);

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
        grantType,
        page: pageIndex + 1,
        pageSize,
        sort: sortBy && `${sortBy.desc ? '-' : '+'}${sortBy.id}`,
        ...otherFilters,
      };

      await Router.push(
        `/admin/grant/${grantType}`,
        {
          pathname: `/admin/grant/${grantType}`,
          query,
        },
        { shallow: true }
      );

      try {
        setError(null);
        const { applications, pagination } = await fetchApplications(query);
        setData(applications);
        setPageCount(pagination.totalPages);
        setTotalRecords(pagination.totalRecords);
        setLoading(false);
      } catch (e) {
        if (e.response.status === 400) {
          setValues({ pageIndex: 0, pageSize, sortBy, ...otherFilters });
          return;
        }

        if (e.response.status === 404) {
          setError(e.message);
          return;
        }

        setError(e.response.data);
      }
    },
    []
  );

  const handleSearchTermChange = (event) => {
    setSearchTermInput(event.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setFilters({
      ...filters,
      searchTerm: searchTermInput,
    });
  };

  const resetFilters = useCallback((e) => {
    e.preventDefault();

    setSearchTermInput('');
    setFilters({
      pageIndex: 0,
      pageSize: 10,
      sortBy: '+applicationDate',
      status: '',
      grantOfficer: '',
      applicationId: '',
      businessCategory: '',
      businessSize: '',
      businessPremises: '',
      searchTerm: '',
    });
  }, []);

  return !error ? (
    <>
      <form onSubmit={handleSearch}>
        <TextInput
          name="searchTerm"
          label="Search"
          value={searchTermInput || ''}
          onChange={handleSearchTermChange}
        />

        <details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              Advanced filters
            </span>
          </summary>
          <div className="govuk-details__text">
            <BasicSelect
              options={Object.values(APPLICATION_STATE)}
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
              options={BUSINESS_CATEGORIES}
              label="Filter by Business Category:"
              value={filters.businessCategory}
              onChange={(businessCategory) => setValues({ businessCategory })}
            />

            <BasicSelect
              options={BUSINESS_SIZE}
              label="Filter by Business Size:"
              value={filters.businessSize}
              onChange={(businessSize) => setValues({ businessSize })}
            />

            <BasicSelect
              options={TYPE_OF_BUSINESS}
              label="Filter by Business Premises:"
              value={filters.businessPremises}
              onChange={(businessPremises) => setValues({ businessPremises })}
            />

            <BasicSelect
              options={Object.keys(DATES)}
              label="Filter by ARG round:"
              onChange={(date) => setValues({ date: DATES[date] })}
            />
          </div>
        </details>

        <div className="govuk-button-group">
          <button
            className="govuk-button"
            data-module="govuk-button"
            type="submit"
          >
            Search
          </button>
          <a
            href="#"
            className="govuk-link"
            role="button"
            onClick={resetFilters}
          >
            Clear filters
          </a>
        </div>
      </form>

      <Table
        columns={columns}
        data={data}
        fetchData={setValues}
        loading={loading}
        pageCount={pageCount}
        totalRecords={totalRecords}
        initialPage={page}
        initialPageSize={pageSize}
        initialSortBy={sort ? sort : '+applicationDate'}
      />
    </>
  ) : (
    <ErrorMessage text={error} />
  );
};

export function getQueryParametersAsObject() {
  const nextRouter = useRouter();
  const queryString = nextRouter.asPath.split(/\?/)[1];

  return Object.fromEntries(new URLSearchParams(queryString));
}

export default ApplicationsList;
