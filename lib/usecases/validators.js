import * as yup from 'yup';

yup.addMethod(yup.string, 'integer', function () {
  return this.matches(/^\d+$/, {
    message: '${path} should have digits only',
    excludeEmptyString: true,
  });
});
const stringToBool = (v, o) => o === 'Yes';

const ohlgSchema = yup.object().shape({
  grantType: yup.string().required(),
  declaration: yup
    .object()
    .shape({
      name: yup.string().required(),
      contactTypeId: yup.string().required(),
      contactTypeIdText: yup.string(),
      authoriseOnBehalf: yup.bool().required(),
      businessMeetsCriteria: yup.bool().required(),
      businessIWillInform: yup.bool().required(),
      businessNotExceedPermittedAllowance: yup.bool().required(),
      businessRecoverableAgreement: yup.bool().required(),
      businessPermitData: yup.bool().required(),
      businessShareWithBEIS: yup.bool().required(),
      businessHappyContacted: yup.bool().required(),
    })
    .required(),
  businessBankAccount: yup
    .object()
    .shape({
      bankName: yup.string().required(),
      accountHolder: yup.string().required(),
      accountNumber: yup.string().integer().min(8).max(8).required(),
      accountSortcode: yup.string().integer().min(6).max(6).required(),
    })
    .required(),
  supplementaryInformation: yup
    .object()
    .shape({
      bankStatement: yup.array().of(yup.string().required()).required(),
    })
    .required(),
  business: yup
    .object()
    .shape({
      businessName: yup.string().required(),
      registeredName: yup.string(),
      businessStructure: yup.string().required(),
      businessStructureText: yup.string(),
      businessIdentifyType: yup.string().required(),
      businessIdentifyNumber: yup.string().required(),
      highLevelSicCode: yup.string(),
      businessRatesAccountNumber: yup.string(),
      businessRatesPropertyReferenceNumber: yup.string(),
      businessRatesPayer: yup.string(),
      businessTradingAddress: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      businessAddress: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      businessSector: yup.string().required(),
      businessNature: yup.string().required(),
      isBusinessStillTrading: yup.bool().transform(stringToBool).required(),
      isBusinessStillTradingDateStopped: yup.string(),
      dateEstablished: yup.string(),
      businessSize: yup.string(),
      businessRateableValue: yup.string().integer(),
      businessWebsite: yup.string(),
    })
    .required(),
  contact: yup
    .object()
    .shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      emailAddress: yup.string().email().required(),
      telephoneNumber: yup.string().integer().required(),
      address: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      dateOfBirth: yup.string(),
    })
    .required(),
  eligibilityCriteria: yup
    .object()
    .shape({
      tradingInHackney: yup.bool().transform(stringToBool).required(),
      liableForBusinessRates: yup.bool().transform(stringToBool).required(),
      businessSectorEligible: yup.bool().transform(stringToBool).required(),
      eligibleForOhlg: yup.bool().transform(stringToBool).required(),
      servedLegalNotices: yup.bool().transform(stringToBool).required(),
    })
    .required(),
});

const argSchema = yup.object().shape({
  grantType: yup.string().required(),
  declaration: yup
    .object()
    .shape({
      name: yup.string().required(),
      contactTypeId: yup.string().required(),
      contactTypeIdText: yup.string(),
      authoriseOnBehalf: yup.bool().required(),
      cannotUseAsWageSupport: yup.bool().required(),
      businessMeetsCriteria: yup.bool().required(),
      businessIWillInform: yup.bool().required(),
      businessNotExceedPermittedAllowance: yup.bool().required(),
      businessRecoverableAgreement: yup.bool().required(),
      businessPermitData: yup.bool().required(),
      businessShareWithBEIS: yup.bool().required(),
      businessHappyContacted: yup.bool().required(),
    })
    .required(),
  businessBankAccount: yup
    .object()
    .shape({
      bankName: yup.string().required(),
      accountHolder: yup.string().required(),
      accountNumber: yup.string().integer().min(8).max(8).required(),
      accountSortcode: yup.string().integer().min(6).max(6).required(),
    })
    .required(),
  supplementaryInformation: yup
    .object()
    .shape({
      bankStatement: yup.array().of(yup.string().required()).required(),
      ratesBill: yup.array().of(yup.string().required()),
      leaseOrRentalAgreement: yup
        .array()
        .of(yup.string().required())
        .required(),
      employeesConfirmation: yup.array().of(yup.string().required()),
      photoId: yup.array().of(yup.string().required()).required(),
      taxReturn: yup.array().of(yup.string().required()),
    })
    .required(),
  business: yup
    .object()
    .shape({
      doesPayBusinessRates: yup.bool().transform(stringToBool).required(),
      businessSize: yup.string().required(),
      numberOfEmployees: yup.string().integer().required(),
      sicCategory: yup.string().required(),
      highLevelSicCode: yup.string().required(),
      businessNature: yup.string().required(),
      businessNatureHospitality: yup.string(),
      businessTradingName: yup.string().required(),
      businessRegisteredName: yup.string(),
      dateEstablished: yup.string().required(),
      businessStructure: yup.string().required(),
      businessIdentifyType: yup.string().required(),
      businessIdentifyNumber: yup.string().required(),
      businessRatesAccountNumber: yup.string(),
      businessRatesPayer: yup.string(),
      businessTradingAddress: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      businessAddress: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      businessPremisesDescription: yup.string().required(),
      businessRateableValue: yup.string(),
      businessWebsite: yup.string(),
      businessImpactStatement: yup.string().required(),
    })
    .required(),
  contact: yup
    .object()
    .shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      emailAddress: yup.string().email().required(),
      telephoneNumber: yup.string().integer().required(),
      address: yup
        .object()
        .shape({
          buildName: yup.string(),
          streetNumber: yup.string().required(),
          street: yup.string().required(),
          town: yup.string().required(),
          postcode: yup.string().required(),
        })
        .required(),
      dateOfBirth: yup.string(),
    })
    .required(),
  eligibilityCriteria: yup
    .object()
    .shape({
      tradingInHackney: yup.bool().transform(stringToBool).required(),
      isEligibleForArg: yup.bool().transform(stringToBool).required(),
      servedLegalNotices: yup.bool().transform(stringToBool).required(),
      businessIsTrading: yup.bool().transform(stringToBool).required(),
      eligibleForOhlg: yup.bool().transform(stringToBool).required(),
    })
    .required(),
});

export default (data) => {
  if (data.grantType) {
    if (data.grantType == 'ohlg') return ohlgSchema.validate(data);
    if (data.grantType == 'arg') return argSchema.validate(data);
  }

  console.log(`Unknown grant type ${data.GrantType}`);
  return null;
};
