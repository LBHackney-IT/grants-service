import getDb from '../gateways/db';
import { APPLICATION_STATE } from '../dbMapping';
import { APPLICATION_NOT_FOUND } from '../constants';

export default async ({ clientGeneratedId }) => {
  const dbInstance = await getDb.getInstance();
  let applicationData = {};

  try {
    applicationData = await getApplicationData(dbInstance, clientGeneratedId);
  } catch (error) {
    if (error.name === 'QueryResultError' && error.code === 0) {
      return createErrorResponse(APPLICATION_NOT_FOUND);
    }
    return createErrorResponse(error.message);
  }

  const uploadedDocuments = await getDocuments(dbInstance, clientGeneratedId);

  return {
    application: {
      clientGeneratedId,
      applicationDate: new Date(
        applicationData.date_time_recorded
      ).toISOString(),
      status: APPLICATION_STATE[applicationData.application_state_id],
      grantAmountAwarded: 0,
      paymentExported: false,
      ...applicationData.application_json,
      documents: uploadedDocuments,
    },
    validations: applicationData.validations,
  };
};

const getApplicationData = async (dbInstance, clientGeneratedId) => {
  const query = `SELECT
                  ga.client_generated_id,
                  ga.date_time_recorded,
                  ga.application_json,
                  aa.application_state_id,
                  aa.validations
                FROM
                  grant_application ga
                  JOIN
                      application_assessment aa
                      ON ga.id = aa.grant_application_id
                WHERE
                  ga.client_generated_id = $1;`;
  return await dbInstance.one(query, [clientGeneratedId]);
};

const getDocuments = async (dbInstance, clientGeneratedId) => {
  const query = `SELECT s3_path, document_type
                  FROM grant_application AS ga
                  JOIN document_upload AS du
                      ON ga.id = du.grant_application_id
                  WHERE ga.client_generated_id = $1
                  ORDER BY du.document_type;`;
  const documentData = await dbInstance.any(query, [clientGeneratedId]);
  let documents = [];

  documents = documentData.map((row) => ({
    s3Path: encodeURIComponent(row.s3_path),
    documentType: row.document_type,
  }));

  return documents;
};

const createErrorResponse = (error) => {
  return {
    applications: null,
    pagination: null,
    error,
  };
};
