import {
  APPLICATION_STATE,
  BUSINESS_CATEGORIES,
  BUSINESS_SIZE,
  DATES,
  TYPE_OF_BUSINESS,
} from '../dbMapping';

export const PAGE_MUST_BE_AT_LEAST_ONE =
  'Cannot list applications. Page must be at least 1.';
export const PAGINATED_PAST_END =
  'Cannot list applications. It appears that you have paginated beyond the end.';

const businessName = (grantType) =>
  grantType == 'arg'
    ? `ga.application_json -> 'business' ->> 'businessTradingName'`
    : `ga.application_json -> 'business' ->> 'businessName'`;

const listApplications =
  ({ getDbInstance, getListGrantOfficers }) =>
  async ({
    grantType,
    currentPage,
    pageSize,
    sort,
    status,
    businessCategory,
    grantOfficer,
    clientGeneratedId,
    businessSize,
    businessPremises,
    date,
    searchTerm,
  }) => {
    currentPage = currentPage !== undefined ? currentPage : 1;
    pageSize = pageSize || 10;
    sort = sort || '+applicationDate';

    if (currentPage < 1) {
      return createErrorResponse(PAGE_MUST_BE_AT_LEAST_ONE);
    }

    const offset = (currentPage - 1) * pageSize;
    let sortBy = 'ga.date_time_recorded';

    switch (sort.slice(1)) {
      case 'businessName':
        sortBy = `LOWER(${businessName(grantType)})`;
        break;
    }

    const sortDirection = sort.slice(0, 1) === '-' ? 'DESC' : 'ASC';
    const statesFilter = calculateStatesFilter(status);
    const businessCategoriesFilter =
      calculateBusinessCategoriesFilter(businessCategory);

    const businessSizeFilter = calculateBusinessSizeFilter(businessSize);
    const businessPremisesFilter =
      calculateBusinessPremisesFilter(businessPremises);

    const listGrantOfficers = getListGrantOfficers();
    const grantOfficerFilter = await calculateGrantOfficersFilter(
      listGrantOfficers,
      grantOfficer
    );

    const clientGeneratedIdFilter = clientGeneratedId || '%';
    const beforeOrAfterDate = determineBeforeOrAfterDate(date);

    const db = await getDbInstance();

    const query = `SELECT 
                  ga.client_generated_id,
                  ga.date_time_recorded,
                  ga.application_json,
                  aps.description As status,
                  ${businessName(grantType)} As business_name,
                  COUNT(*) OVER() AS total_applications
                FROM grant_application ga JOIN application_assessment aa
                ON ga.id = aa.grant_application_id JOIN application_state aps
                ON aps.id = aa.application_state_id
                ${
                  grantOfficerFilter.length > 0
                    ? `JOIN (
                  SELECT DISTINCT grant_application_id
                    FROM application_history
                    WHERE user_recorded IN ($(grantOfficerFilter:list))
                  ) AS ah
                  ON ga.id = ah.grant_application_id`
                    : ''
                }
                WHERE ga.grant_type = $(grantType)
                AND   aa.application_state_id IN ($(statesFilter:list))
                AND   ga.client_generated_id LIKE $(clientGeneratedIdFilter)
                AND   DATE(ga.date_time_recorded) ${beforeOrAfterDate} COALESCE($(date), DATE(ga.date_time_recorded))
                ${
                  searchTerm
                    ? `AND (
                        ${businessName(grantType)} ILIKE $(searchTerm)
                        OR ga.client_generated_id ILIKE $(searchTerm)
                      )`
                    : ''
                }
                ORDER BY ${sortBy} ${sortDirection}
                LIMIT $(pageSize) OFFSET $(offset);`;

    const applications = await db.any(query, {
      grantType,
      pageSize,
      offset,
      statesFilter,
      businessCategoriesFilter,
      grantOfficerFilter,
      clientGeneratedIdFilter,
      businessSizeFilter,
      businessPremisesFilter,
      date,
      searchTerm: searchTerm ? `%${searchTerm}%` : undefined,
    });

    const totalPages = calculateTotalPages();
    const totalApplications = calculateTotalApplications();

    if (totalPages === 0 && currentPage > 1) {
      return createErrorResponse(PAGINATED_PAST_END);
    }

    return {
      applications: applications.map((application) => {
        return {
          clientGeneratedId: application.client_generated_id,
          businessName: application.business_name,
          applicationDate: new Date(
            application.date_time_recorded
          ).toISOString(),
          status: application.status,
        };
      }),
      pagination: {
        totalRecords: totalApplications,
        totalPages,
        currentPage,
        links: {
          firstPage: createPageURL(1),
          lastPage: createPageURL(totalPages),
          previousPage: createPageURL(currentPage - 1),
          nextPage: createPageURL(currentPage + 1),
        },
      },
      error: null,
    };

    function determineBeforeOrAfterDate(date) {
      let querySign = '';

      if (date === Object.values(DATES)[0]) {
        querySign = '<=';
      } else {
        querySign = '>=';
      }

      return querySign;
    }

    function calculateTotalPages() {
      let totalPages = 0;
      if (applications.length > 0) {
        totalPages = Math.ceil(applications[0].total_applications / pageSize);
      }
      return totalPages;
    }

    function calculateTotalApplications() {
      return applications.length == 0 ? 0 : applications[0].total_applications;
    }

    function createPageURL(page) {
      if (page < 1) {
        return null;
      }
      return `/api/applications?page=${page}&pageSize=${pageSize}`;
    }

    function createErrorResponse(error) {
      return {
        applications: null,
        pagination: null,
        error,
      };
    }

    function calculateStatesFilter(requiredState) {
      let result = [];

      requiredState = requiredState || '';
      const statusIndex = Object.keys(APPLICATION_STATE).find(
        (key) => APPLICATION_STATE[key] === requiredState
      );
      if (statusIndex) {
        result.push(statusIndex);
      } else {
        result = Object.keys(APPLICATION_STATE);
      }
      return result;
    }

    function calculateBusinessCategoriesFilter(requiredBusinessCategory) {
      let result = [];

      requiredBusinessCategory = requiredBusinessCategory || '';
      const businessCategoryIndex = BUSINESS_CATEGORIES.findIndex(
        (businessCategory) => businessCategory === requiredBusinessCategory
      );

      if (businessCategoryIndex !== -1) {
        result.push(businessCategoryIndex + 1);
      } else {
        for (let x = 0; x < BUSINESS_CATEGORIES.length; x++) {
          result.push(x + 1);
        }
      }
      return result;
    }

    function calculateBusinessSizeFilter(requiredBusinessSize) {
      let result = [];

      requiredBusinessSize = requiredBusinessSize || '';
      const businessSizeIndex = BUSINESS_SIZE.findIndex(
        (businessSize) => businessSize === requiredBusinessSize
      );

      if (businessSizeIndex !== -1) {
        result.push(businessSizeIndex + 1);
      } else {
        for (let x = 0; x < BUSINESS_SIZE.length; x++) {
          result.push(x + 1);
        }
      }
      return result;
    }

    function calculateBusinessPremisesFilter(requiredBusinessPremises) {
      let result = [];

      requiredBusinessPremises = requiredBusinessPremises || '';

      const businessPremisesIndex = TYPE_OF_BUSINESS.findIndex(
        (businessPremises) => businessPremises === requiredBusinessPremises
      );

      if (businessPremisesIndex !== -1) {
        result.push(TYPE_OF_BUSINESS[businessPremisesIndex]);
      } else {
        for (let x = 0; x < TYPE_OF_BUSINESS.length; x++) {
          result.push(TYPE_OF_BUSINESS[x]);
        }
      }
      return result;
    }

    async function calculateGrantOfficersFilter(
      listGrantOfficers,
      requiredOfficer
    ) {
      const grantOfficersResponse = await listGrantOfficers();
      const allKnownGrantOfficers = grantOfficersResponse.grantOfficers.map(
        (grantOfficer) => grantOfficer.identifier
      );
      requiredOfficer = allKnownGrantOfficers.find(
        (officer) => officer === requiredOfficer
      );
      if (!requiredOfficer) {
        return allKnownGrantOfficers;
      }
      return [requiredOfficer];
    }
  };

export default listApplications;
