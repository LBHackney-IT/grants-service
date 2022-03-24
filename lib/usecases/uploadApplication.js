import getDb from '../gateways/db';

export default async (clientGeneratedId, grantType, applicationJson) => {
  const db = await getDb.getInstance();

  const checkApplicationExistsQuery = `
  SELECT
    ga.id
  FROM
    grant_application ga
  WHERE
    ga.application_json = $(applicationJson);`;

  const result = await db.any(checkApplicationExistsQuery, {
    applicationJson,
  });

  if (result.length > 0) {
    console.log('Duplicate submission attempted');
    throw Error('Duplicate submission detected');
  }

  const grantApplication = await db.one(
    `INSERT INTO grant_application
      (client_generated_id, grant_type, application_json)
      VALUES ($1,$2,$3)
      RETURNING id
        `,
    [clientGeneratedId, grantType, applicationJson]
  );

  const documentPromises = Object.entries(
    applicationJson.supplementaryInformation
  ).reduce(
    (acc, [fileType, value]) => [
      ...acc,
      ...value.map((file) =>
        db.none(
          `INSERT INTO document_upload
          (grant_application_id, s3_path, document_type)
          VALUES($1, $2, $3)`,
          [grantApplication.id, file, fileType]
        )
      ),
    ],
    []
  );

  const documentInsertResults = await Promise.allSettled(documentPromises);
  for (const promiseResult in documentInsertResults) {
    if (promiseResult.status === 'rejected') {
      throw Error('A document failed to be inserted in the db');
    }
  }

  await db.none(
    `INSERT INTO application_assessment
    (grant_application_id, application_state_id, validations)
     VALUES($1, $2, $3)`,
    [grantApplication.id, 1, '{}']
  );

  await db.none(
    `INSERT INTO application_history
    (grant_application_id, user_recorded, notes)
    VALUES($1, $2, $3);`,
    [grantApplication.id, 'system', 'Application received']
  );
};
