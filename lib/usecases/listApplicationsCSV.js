import ObjectsToCsv from 'objects-to-csv';
import { FREE_TEXT } from '../dbMapping';

const listApplicationsCSV =
  ({ getDbInstance }) =>
  async ({ grantType }) => {
    const db = await getDbInstance();

    const query = `
    SELECT
       ga.client_generated_id,
       apst.description AS application_status,

       CASE
        WHEN $(grantType) = 'ohlg'
          THEN ga.application_json -> 'business' ->> 'businessName'
        ELSE ga.application_json -> 'business' ->> 'businessTradingName'
       END AS business_trading_name,

       CASE
        WHEN $(grantType) = 'ohlg'
          THEN ga.application_json -> 'business' ->> 'registeredName'
        ELSE ga.application_json -> 'business' ->> 'businessRegisteredName'
       END AS business_registered_name,

       ga.application_json -> 'business' ->> 'businessIdentifyType' as business_identifying_number_type,
       ga.application_json -> 'business' ->> 'businessIdentifyNumber' as business_identifying_number,

       CASE
       WHEN $(grantType) = 'ohlg'
         THEN ga.application_json -> 'business' ->> 'businessSize'
       ELSE ga.application_json -> 'business' ->> 'numberOfEmployees'
      END AS number_of_employees,

      CASE
       WHEN $(grantType) = 'ohlg'
         THEN ga.application_json -> 'business' ->> 'businessSize'
       ELSE ga.application_json -> 'business' ->> 'businessSize'
      END AS business_size,

      CASE
       WHEN $(grantType) = 'ohlg'
         THEN ga.application_json -> 'business' ->> 'businessSector'
       ELSE ga.application_json -> 'business' ->> 'sicCategory'
      END AS business_category,

      ga.application_json -> 'business' ->> 'businessRatesAccountNumber' as business_rates_account_number,
     
      ${
        grantType == 'ohlg'
          ? `CASE
          WHEN LENGTH(ga.application_json -> 'business' ->> 'businessStructureText') > 0
            THEN ga.application_json -> 'business' ->> 'businessStructureText'
          ELSE ga.application_json -> 'business' ->> 'businessStructure'
         END AS business_premises_description,`
          : ''
      }

      ${
        grantType == 'arg'
          ? `CASE
          WHEN LENGTH(ga.application_json -> 'business' ->> 'businessPremisesDescriptionText') > 0
            THEN ga.application_json -> 'business' ->> 'businessPremisesDescriptionText'
          ELSE ga.application_json -> 'business' ->> 'businessPremisesDescription'
         END AS business_premises_description,`
          : ''
      }

       ga.application_json -> 'contact' ->> 'firstName' as contact_first_name,
       ga.application_json -> 'contact' ->> 'lastName' as contact_last_name,
       ga.application_json -> 'contact' ->> 'emailAddress' as contact_email_address,
       ga.application_json -> 'contact' ->> 'telephoneNumber' as contact_telephone_number,
       ga.application_json -> 'contact' ->> 'dateOfBirth' as date_of_birth,

       ga.application_json -> 'business' -> 'businessAddress' ->> 'buildName' as building_name_floor_unit,
       ga.application_json -> 'business' -> 'businessAddress' ->> 'streetNumber' as street_number,
       ga.application_json -> 'business' -> 'businessAddress' ->> 'street' as street,
       ga.application_json -> 'business' -> 'businessAddress' ->> 'town' as town,
       ga.application_json -> 'business' -> 'businessAddress' ->> 'postcode' as business_post_code,

       ga.application_json -> 'businessBankAccount' ->> 'bankName' as bank_name,
       ga.application_json -> 'businessBankAccount' ->> 'accountHolder' as bank_account_holder_name,
       ga.application_json -> 'businessBankAccount' ->> 'accountNumber' as bank_account_number,
       ga.application_json -> 'businessBankAccount' ->> 'accountSortcode' as bank_sort_code
    FROM
      grant_application ga
        JOIN
          application_assessment apa
          ON ga.id = apa.grant_application_id
        JOIN
          application_state apst
          ON apst.id = apa.application_state_id
    WHERE ga.grant_type = $(grantType)
    ORDER BY
      ga.id ASC;`;

    const applications = await db.any(query, {
      grantType,
    });

    const results = applications.map((application) => ({
      client_generated_id: application.client_generated_id,
      application_status: application.application_status,
      business_trading_name: application.business_trading_name,
      business_registered_name: application.business_registered_name,
      business_identifying_number_type:
        application.business_identifying_number_type,
      business_identifying_number: application.business_identifying_number,
      business_size: application.business_size,
      number_of_employees: application.number_of_employees,
      business_category: application.business_category,
      business_premises_description: application.business_premises_description,
      contact_first_name: application.contact_first_name,
      contact_last_name: application.contact_last_name,
      date_of_birth: application.date_of_birth,
      contact_email_address: application.contact_email_address,
      contact_telephone_number: application.contact_telephone_number,
      business_rates_account_number: application.business_rates_account_number,
      building_name_floor_unit: application.building_name_floor_unit,
      street_number: application.street_number,
      street: application.street,
      town: application.town,
      business_post_code: application.business_post_code,
      bank_name: application.bank_name,
      bank_account_holder_name: application.bank_account_holder_name,
      bank_account_number: application.bank_account_number,
      bank_sort_code: application.bank_sort_code,
    }));

    const csvString = await new ObjectsToCsv(results).toString();

    return {
      csvString,
      error: null,
    };
  };

export default listApplicationsCSV;
