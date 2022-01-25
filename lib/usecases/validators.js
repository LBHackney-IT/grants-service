import * as yup from 'yup';

yup.addMethod(yup.string, 'integer', function () {
  return this.matches(/^\d+$/, {
    message: '${path} should have digits only',
    excludeEmptyString: true,
  });
});
const stringToBool = (v, o) => o === 'Yes';

const applicationSchema = yup.object().shape({
  declaration: yup
    .object()
    .shape({
      name: yup.string().required(),
      contactTypeId: yup.string().required(),
      contactTypeIdText: yup.string(),
      authoriseOnBehalf: yup.bool().required(),
      businessMeetsCriteria: yup.bool().required(),
      businessIWillInform: yup.bool().required(),
      businessNotExceed: yup.bool().required(),
      businessNotUndertaking: yup.bool().required(),
      businessRecoverableAgreement: yup.bool().required(),
      businessPermitDataRound2: yup.bool().required(),
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
      previouslyApplied: yup.bool().transform(stringToBool).required(),
      previousApplicationId: yup.string(),
      liableForRates: yup.bool().transform(stringToBool).required(),
      businessSizeId: yup.string().required(),
      howManyEmployees: yup.string().integer().required(),
      businessCategory: yup.string().required(),
      businessReferenceNumber: yup.string(),
      businessDescription: yup.string().required(),
      businessName: yup.string().required(),
      registeredName: yup.string(),
      businessStructure: yup.string().required(),
      businessStructureText: yup.string(),
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
      businessPremisesText: yup.string(),
      tradingDaysPerWeek: yup.string().integer(),
      businessRateableValue: yup.string().integer(),
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
      liableForBusinessRates: yup.bool().transform(stringToBool).required(),
      businessSectorEligible: yup.bool().transform(stringToBool).required(),
      eligibleForOhlg: yup.bool().transform(stringToBool).required(),
      servedLegalNotices: yup.bool().transform(stringToBool).required(),
    })
    .required(),
});

export default (data) => applicationSchema.validate(data);
