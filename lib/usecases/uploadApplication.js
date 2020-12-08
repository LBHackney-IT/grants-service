import getDb from '../gateways/db';
import * as options from 'lib/dbMapping';

export default async ({
  clientGeneratedId,
  eligibilityCriteria,
  eligibilityCriteriaDetails,
  contact,
  business,
  supplementaryInformation,
  businessBankAccount,
  declaration,
}) => {
  const db = await getDb.getInstance();
  const grantApplication = await db.one(
    `INSERT INTO grant_application
      (client_generated_id)
      VALUES ($1)
      RETURNING id
        `,
    [clientGeneratedId]
  );

  await db.none(
    `INSERT INTO eligibility_criteria
      (grant_application_id, trading_in_hackney, liable_for_rates)
      VALUES ($1, $2, $3)`,
    [
      grantApplication.id,
      eligibilityCriteria.tradingInHackney,
      eligibilityCriteria.liableForRates,
    ]
  );

  await db.none(
    `INSERT INTO eligibility_criteria_details
      (grant_application_id, business_size_id, how_many_employees, trading_on_22_03_20, trading_on_16_10_20, trading_on_04_11_20, served_legal_notices, business_category, business_sub_category, business_custom_category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      grantApplication.id,
      options.BUSINESS_SIZE.indexOf(eligibilityCriteriaDetails.businessSizeId) +
        1,
      eligibilityCriteriaDetails.howManyEmployees,
      eligibilityCriteriaDetails.tradingOn220320,
      eligibilityCriteriaDetails.tradingOn161020,
      eligibilityCriteriaDetails.tradingOn041120,
      eligibilityCriteriaDetails.servedLegalNotices,
      eligibilityCriteriaDetails.businessCategory,
      eligibilityCriteriaDetails.businessSubCategory,
      eligibilityCriteriaDetails.businessCustomCategory,
    ]
  );

  await db.one(
    `INSERT INTO contact
      (grant_application_id, first_name, last_name, email_address, telephone_number, date_of_birth)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [
      grantApplication.id,
      contact.firstName,
      contact.lastName,
      contact.emailAddress,
      contact.telephoneNumber,
      contact.dateOfBirth,
    ]
  );

  await db.none(
    `INSERT INTO public.contact_address
      (grant_application_id, first_line, second_line, third_line, ward, postcode)
      VALUES($1, $2, $3, $4, $5, $6)`,
    [
      grantApplication.id,
      contact.address.buildName,
      contact.address.streetNumber,
      contact.address.street,
      contact.address.town,
      contact.address.postcode,
    ]
  );

  await db.one(
    `INSERT INTO business
    (grant_application_id, business_name, registered_name, business_identify_type, business_identify_number, business_rates_account_number, business_rates_payer, business_annual_rent, business_website)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `,

    [
      grantApplication.id,
      business.businessName,
      business.registeredName,
      business.businessIdentifyType,
      business.businessIdentifyNumber,
      business.businessRatesAccountNumber,
      business.businessRatesPayer,
      business.businessAnnualRent,
      business.businessWebsite,
    ]
  );

  await db.none(
    `
    INSERT INTO business_address
    (grant_application_id, first_line, second_line, third_line, ward, postcode)
    VALUES($1, $2, $3, $4, $5, $6)
    `,
    [
      grantApplication.id,
      business.businessAddress.buildName,
      business.businessAddress.streetNumber,
      business.businessAddress.street,
      business.businessAddress.town,
      business.businessAddress.postcode,
    ]
  );

  await db.none(
    `
    INSERT INTO business_trading_address
    (grant_application_id, first_line, second_line, third_line, ward, postcode)
    VALUES($1, $2, $3, $4, $5, $6)
    `,
    [
      grantApplication.id,
      business.businessTradingAddress.buildName,
      business.businessTradingAddress.streetNumber,
      business.businessTradingAddress.street,
      business.businessTradingAddress.town,
      business.businessTradingAddress.postcode,
    ]
  );

  await db.none(
    `INSERT INTO business_bank_account
      (grant_application_id, bank_name, account_holder, account_number, account_sortcode)
      VALUES($1, $2, $3, $4, $5)`,
    [
      grantApplication.id,
      businessBankAccount.bankName,
      businessBankAccount.accountHolder,
      businessBankAccount.accountNumber,
      businessBankAccount.accountSortcode,
    ]
  );

  await db.none(
    `INSERT INTO declaration
     (grant_application_id, name, contact_type_id, authorise_on_behalf, business_meets_criteria, business_intends_reopen, business_i_will_inform, business_not_exceed, business_not_undertaking, business_not_rate_payer, business_permit_data, business_share_with_beis, business_happy_contacted)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      grantApplication.id,
      declaration.name,
      options.CONTACT_TYPE.indexOf(declaration.contactTypeId) + 1,
      declaration.authoriseOnBehalf,
      declaration.businessMeetsCriteria,
      declaration.businessIntendsReopen,
      declaration.businessIWillInform,
      declaration.businessNotExceed,
      declaration.businessNotUndertaking,
      declaration.businessNotRatePayer,
      declaration.businessPermitData,
      declaration.businessShareWithBEIS,
      declaration.businessHappyContacted,
    ]
  );

  const documentPromises = Object.entries(supplementaryInformation).reduce(
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
