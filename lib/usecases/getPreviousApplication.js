import getDb from '../gateways/db';
import { APPLICATION_NOT_FOUND } from '../constants';

export default async (previousApplicationId) => {
  const dbInstance = await getDb.getInstance();
  let application = {};
  try {
    application = await getApplicationData(dbInstance, previousApplicationId);
  } catch (error) {
    if (
      error.name === 'QueryResultError' &&
      // queryResultErrorCode.noData is 0, see https://github.com/vitaly-t/pg-promise/blob/master/lib/errors/query-result-error.js
      error.code === 0
    ) {
      return createErrorResponse(APPLICATION_NOT_FOUND);
    }
    return createErrorResponse(error.message);
  }

  return {
    application: {
      previousApplicationId: application.client_generated_id,
    },
  };
};

const getApplicationData = async (dbInstance, clientGeneratedId) => {
  const query = `
    SELECT ga.client_generated_id
    FROM grant_application AS ga
    WHERE ga.client_generated_id = $1;`;

  return await dbInstance.one(query, [clientGeneratedId]);
};

const createErrorResponse = (error) => {
  return {
    application: null,
    error,
  };
};
