import * as faker from 'faker';
import listApplications from './listApplications';
import {
  APPLICATION_STATE,
  BUSINESS_CATEGORIES,
  BUSINESS_SIZE,
  TYPE_OF_BUSINESS,
} from '../dbMapping';

function createContainerAndSpies(numberOfApplicationsInResponse) {
  const applicationsDatabaseResponse = [];
  for (let count = 1; count <= numberOfApplicationsInResponse; count++) {
    applicationsDatabaseResponse.push({
      date_time_recorded: '2020-06-16T06:16:19.640Z',
      client_generated_id: `ClientGeneratedId${count}`,
      business_name: `Business Name ${count}`,
      status: 'Unprocessed',
    });
  }

  const grantOfficersResponse = { grantOfficers: [] };
  const expectedGrantOfficers = [];
  for (let x = 1; x <= 3; x++) {
    const identifier =
      `${faker.name.firstName()} ${faker.name.lastName()}` +
      ` <${faker.internet.exampleEmail()}>`;
    expectedGrantOfficers.push(identifier);
    grantOfficersResponse.grantOfficers.push({ identifier });
  }

  const databaseSpy = jest.fn();
  databaseSpy.mockReturnValueOnce(applicationsDatabaseResponse);

  const listGrantOfficersSpy = jest.fn();
  listGrantOfficersSpy.mockReturnValueOnce(grantOfficersResponse);

  const container = {
    async getDbInstance() {
      return {
        any: databaseSpy,
      };
    },
    getListGrantOfficers: jest.fn(() => {
      return listGrantOfficersSpy;
    }),
  };
  return { databaseSpy, container, expectedGrantOfficers };
}

describe('listApplications', () => {
  // Todo: Test that the correct errors are returned when nonsense passed in or something goes wrong.

  test('returns a JSON object containing the applications', async () => {
    const { databaseSpy, container } = createContainerAndSpies(10);

    const { applications, error } = await listApplications(container)({
      grantType: 'arg',
      currentPage: 1,
      pageSize: 10,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(expect.anything(), {
      grantType: 'arg',
      pageSize: 10,
      offset: 0,
      statesFilter: expect.anything(),
      grantOfficerFilter: expect.anything(),
      clientGeneratedIdFilter: expect.anything(),
      businessCategoriesFilter: expect.anything(),
      businessSizeFilter: expect.anything(),
      businessPremisesFilter: expect.anything(),
      date: undefined,
      searchTerm: undefined,
    });
    expect(applications).toHaveLength(10);
    expect(applications[0]).toEqual({
      clientGeneratedId: 'ClientGeneratedId1',
      businessName: 'Business Name 1',
      applicationDate: '2020-06-16T06:16:19.640Z',
      status: 'Unprocessed',
    });
    expect(applications[9]).toEqual({
      clientGeneratedId: 'ClientGeneratedId10',
      businessName: 'Business Name 10',
      applicationDate: '2020-06-16T06:16:19.640Z',
      status: 'Unprocessed',
    });
  });

  test('defaults currentPage to 1 and pageSize to 10', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        pageSize: 10,
        offset: 0,
      })
    );
  });

  test('filters by the provided grant type', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      grantType: 'some-grant-type',
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('WHERE ga.grant_type = $(grantType)'),
      expect.objectContaining({
        grantType: 'some-grant-type',
      })
    );
  });

  test('does not join the grant officers data if the grant officers list is empty', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    container.getListGrantOfficers.mockImplementationOnce(() => {
      return () => ({
        grantOfficers: [],
      });
    });

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.not.stringContaining(
        'WHERE user_recorded IN ($(grantOfficerFilter:list))'
      ),
      expect.anything()
    );
  });

  test('includes the search WHERE clauses if no search term is provided', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      searchTerm: undefined,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.not.stringContaining('b.business_name ILIKE $(searchTerm)'),
      expect.anything()
    );
  });

  test('includes the search WHERE clauses if a search term is provided', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      searchTerm: 'some-search-term',
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('b.business_name ILIKE $(searchTerm)'),
      expect.objectContaining({
        searchTerm: `%some-search-term%`,
      })
    );
  });

  test('passes through currentPage and pageSize', async () => {
    const { databaseSpy, container } = createContainerAndSpies(10);

    const { error } = await listApplications(container)({
      currentPage: 2,
      pageSize: 3,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        pageSize: 3,
        offset: 3,
      })
    );
  });

  test('defaults sort param to +applicationDate', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY ga.date_time_recorded ASC'),
      expect.anything()
    );
  });

  test('passes through sort param', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      sort: '+businessName',
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY LOWER(b.business_name) ASC'),
      expect.anything()
    );
  });

  test('sets sort ascending for +...', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      sort: '+businessName',
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY LOWER(b.business_name) ASC'),
      expect.anything()
    );
  });

  test('sets sort ascending for -...', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      sort: '-businessName',
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY LOWER(b.business_name) DESC'),
      expect.anything()
    );
  });

  test('limit and offset parameters are included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('LIMIT $(pageSize) OFFSET $(offset)'),
      expect.anything()
    );
  });

  test('application state ids are included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('AND aa.application_state_id IN '),
      expect.anything()
    );
  });

  test('when status is undefined all known states is included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({ status: undefined });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statesFilter: expect.arrayContaining([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '9',
          '10',
          '11',
          '12',
        ]),
      })
    );
  });

  test('when status is defined & found, only that status is queried', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const statusIndex = '1';
    const desiredStatus = APPLICATION_STATE[statusIndex];
    const expectedStatus = statusIndex;

    const { error } = await listApplications(container)({
      status: desiredStatus,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        statesFilter: expect.arrayContaining([expectedStatus]),
      })
    );
  });

  test('when businessCategory is defined & found, only that businessCategory is queried', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const businessCategoryIndex = 1;
    const desiredBusinessCategory = BUSINESS_CATEGORIES[businessCategoryIndex];
    const expectedBusinessCategory = businessCategoryIndex + 1;

    const { error } = await listApplications(container)({
      businessCategory: desiredBusinessCategory,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        businessCategoriesFilter: expect.arrayContaining([
          expectedBusinessCategory,
        ]),
      })
    );
  });

  test('when businessSize is defined & found, only that businessSize is queried', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const businessSizeIndex = 1;
    const desiredBusinessSize = BUSINESS_SIZE[businessSizeIndex];
    const expectedBusinessSize = businessSizeIndex + 1;

    const { error } = await listApplications(container)({
      businessSize: desiredBusinessSize,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        businessSizeFilter: expect.arrayContaining([expectedBusinessSize]),
      })
    );
  });

  test('when businessPremises is defined & found, only that businessPremises is queried', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const businessPremisesIndex = 1;
    const desiredBusinessPremises = TYPE_OF_BUSINESS[businessPremisesIndex];
    const expectedBusinessPremises = TYPE_OF_BUSINESS[businessPremisesIndex];
    const notExpectedBusinessPremises =
      TYPE_OF_BUSINESS[businessPremisesIndex + 1];

    const { error } = await listApplications(container)({
      businessPremises: desiredBusinessPremises,
    });
    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        businessPremisesFilter: expect.arrayContaining([
          expectedBusinessPremises,
        ]),
      })
    );
    expect(databaseSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        businessPremisesFilter: expect.arrayContaining([
          notExpectedBusinessPremises,
        ]),
      })
    );
  });

  test('when date is defined, only that date is queried', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const date = '2020-12-25';

    const { error } = await listApplications(container)({
      date,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        date,
      })
    );
  });

  test('grant officers are included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'WHERE user_recorded IN ($(grantOfficerFilter:list))'
      ),
      expect.anything()
    );
  });

  test('when grantOfficer is undefined a list of known grantOfficer are included in the query', async () => {
    const { databaseSpy, container, expectedGrantOfficers } =
      createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      grantOfficer: undefined,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        grantOfficerFilter: expect.arrayContaining(expectedGrantOfficers),
      })
    );
  });

  test('when grantOfficer is defined & found, only that grantOfficer is queried', async () => {
    const { databaseSpy, container, expectedGrantOfficers } =
      createContainerAndSpies(0);
    const expectedGrantOfficer = expectedGrantOfficers.pop();

    const { error } = await listApplications(container)({
      grantOfficer: expectedGrantOfficer,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        grantOfficerFilter: expect.arrayContaining([expectedGrantOfficer]),
      })
    );
  });

  test('clientGeneratedId is included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({});

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.stringContaining('AND ga.client_generated_id LIKE '),
      expect.anything()
    );
  });

  test('when clientGeneratedId is undefined a wildcard is included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);

    const { error } = await listApplications(container)({
      clientGeneratedId: undefined,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        clientGeneratedIdFilter: '%',
      })
    );
  });

  test('when clientGeneratedId is defined, clientGeneratedId is included in the query', async () => {
    const { databaseSpy, container } = createContainerAndSpies(0);
    const clientGeneratedId = faker.random.uuid();

    const { error } = await listApplications(container)({
      clientGeneratedId,
    });

    expect(error).toBeNull();
    expect(databaseSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        clientGeneratedIdFilter: clientGeneratedId,
      })
    );
  });
});
