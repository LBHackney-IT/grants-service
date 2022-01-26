import isValid from 'date-fns/isValid';
import isPast from 'date-fns/isPast';

import EligibilityCriteria from './EligibilityCriteria';
import SupplementaryInformation from './SupplementaryInformation';
import YourDetails from './YourDetails';
import BusinessDetails from './BusinessDetails';
import BankDetails from './BankDetails';
import Declaration from './Declaration';
import Summary from './Summary';
import * as options from '../../../lib/dbMapping';

export const steps = {
  'eligibility-criteria': EligibilityCriteria,
  'business-details': BusinessDetails,
  'your-details': YourDetails,
  'bank-details': BankDetails,
  'supplementary-information': SupplementaryInformation,
  declaration: Declaration,
  summary: Summary,
};

export const inputLabels = {
  eligibilityCriteria: {
    tradingInHackney: {
      label:
        'Is your business a small or micro business (defined as having 49 or less employees) based in and trading in Hackney?',
      validation: { required: true },
      adminValidation: true,
      validAnswer: 'Yes',
    },
    isEligibleForArg: {
      label: (
        <>
          <p>
            Does your business meet the following criteria for the Omicron
            Additional Restrictions Grant, please read{' '}
            <a
              href="https://drive.google.com/file/d/1so9CkQdO8U47Tps47T59mi-rmMYEhfKu/view?usp=sharing"
              target="_blank"
            >
              this document
            </a>{' '}
            to establish if your business is eligible to receive this grant.
          </p>
        </>
      ),
      hint: (
        <>
          Your business is:
          <ul>
            <li>
              a) A gym or sports businesses where physical exercise or training
              is conducted on an individual basis or a group basis (either with
              or without a Hackney business rates account); or
            </li>

            <li>
              b) A hospitality, leisure or accommodation business that is not a
              Hackney business rate account holder and therefore not eligible
              for the Omicron Hospitality and Leisure Grant; or
            </li>
            <li>
              c) A business which supplies the hospitality, leisure or
              accommodation sectors (either with or without a Hackney business
              rates account).
            </li>
          </ul>
        </>
      ),
      validation: { required: true },
      validAnswer: 'Yes',
    },
    servedLegalNotices: {
      label:
        'Is your business in administration, dissolved, in liquidation, insolvent, struck off on Companies House, or in receipt of a striking off notice?',
      validation: { required: true },
      adminValidation: true,
      validAnswer: 'No',
    },
    businessIsTrading: {
      label: 'Is your business currently trading?',
      validation: { required: true },
      validAnswer: 'Yes',
    },
    eligibleForOhlg: {
      label:
        'Is your business eligible for the Omicron Hospitality and Leisure Grant?',
      adminValidation: true,
      validation: { required: true },
      validAnswer: 'No',
    },
  },
  business: {
    doesPayBusinessRates: {
      label: 'Does your business pay business rates?',
      validation: { required: true },
      adminValidation: true,
    },
    businessSize: {
      label: 'What is the size of your business?',
      options: options.SMALL_BUSINESS_SIZES,
      validation: { required: true },
      adminValidation: true,
    },
    numberOfEmployees: {
      label: 'How many PAYE employees does your business have?',
      validation: {
        required: true,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Must be a number',
        },
      },
      adminValidation: true,
    },
    sicCategory: {
      label: (
        <>
          Please select the dropdown category which best describes your business
          activity. Guidance on which category your business falls into can be
          found here:{' '}
          <a href="http://resources.companieshouse.gov.uk/sic/" target="_blank">
            Standard Industrial Classification (SIC) codes
          </a>
          <p>
            Please check this website to make sure you are selecting the correct
            drop down category for your business.
          </p>
        </>
      ),
      options: options.BUSINESS_CATEGORIES,
      validation: { required: true },
    },
    highLevelSicCode: {
      label: (
        <>
          Please provide the reference number that best describes your business
          from the{' '}
          <a href="http://resources.companieshouse.gov.uk/sic/" target="_blank">
            business classification website
          </a>
          .
        </>
      ),
      validation: { required: true },
    },
    businessNature: {
      label:
        'Please set out what your business does and the services it provides:',
      validation: { required: true },
    },
    businessNatureHospitality: {
      label:
        'If your business supplies the hospitality, leisure or accommodation sectors, or you are a business whose main business income is closely related to these sectors in relation to the service/services it provides, then please provide details of this here:',
    },
    businessTradingName: {
      label: 'Business Trading Name',
      validation: { required: true },
    },
    businessRegisteredName: {
      label:
        'Business Registered Name (if different from Business Trading Name)',
    },
    dateEstablished: {
      label: 'Date that your business started/was established',
      validation: { required: true },
    },
    businessStructure: {
      label: 'Business Structure',
      options: options.COMPANY_STRUCTURE,
      validation: {
        required: 'Business Structure is required',
        validate: (value) => value !== '',
      },
      adminValidation: true,
    },
    businessStructureText: {},
    businessIdentifyType: {
      label: 'Please supply one of the following Business Identifying Numbers:',
      hint: `Where available, please provide your Company Number as listed on Companies House. If you don’t have a Company
        Number, please provide another number from the list below.`,
      options: options.TYPE_IDENTIFIER_NUMBER,
      validation: {
        required: true,
      },
    },
    businessIdentifyNumber: {
      validation: {
        required: true,
      },
    },
    businessIdentifyNumberCompanyNumber: {
      validation: {
        required: true,
        pattern: {
          value: /^[a-zA-Z0-9]{7,8}$/,
        },
      },
    },
    businessIdentifyNumberVAT: {
      type: 'number',
      hint: `Please enter your 9 digit number, without the 'GB' at the start, for example 123456789. You can find it on your
        VAT registration certificate.`,
      validation: {
        required: true,
        pattern: {
          value: /^\d{9}$/,
        },
      },
    },
    businessIdentifyNumberNIN: {
      validation: {
        required: true,
        pattern: {
          value: /^[0-9a-z]{9}$/i,
        },
      },
    },
    businessIdentifyNumberUTR: {
      validation: {
        required: true,
        pattern: {
          value: /^(\d{10}|\d{9}K)$/i,
        },
      },
    },
    businessRatesAccountNumber: {
      label: 'Business Rates Account Number',
      hint: 'A nine digit number starting with a 6 - this is shown on your business rates bill. ',
      validation: {
        pattern: {
          value: /^6(\d{8}|\d{7}x)$/i,
        },
      },
    },
    businessRatesPayer: {
      label: 'Name of Business Rates Payer',
      hint: 'As shown on your business rates bill.',
    },
    businessTradingAddress: {
      label: 'Business Registered Trading Address',
    },
    businessAddress: {
      label: 'Business Premises Address in the London Borough of Hackney',
      hint: (
        <>
          <p>
            Please provide your usual business address in Hackney. If you are
            now working from home as a result of the pandemic but are normally
            based in a commercial premises in Hackney and plan to return to the
            same commercial premises in the future please provide this address.
          </p>

          <p>
            For businesses who were working from a residential premises in
            Hackney prior to the pandemic and who will remain working from this
            premises in the future please provide this address.
          </p>
        </>
      ),
    },
    businessPremisesDescription: {
      label: 'Business Premises Description',
      validation: { required: true },
      options: options.TYPE_OF_BUSINESS,
      adminValidation: true,
    },
    businessPremisesDescriptionText: {},
    businessRateableValue: {
      label: 'Business Premises Rateable Value (if applicable):',
      type: 'number',
      inputMode: 'numeric',
    },
    businessWebsite: {
      label: 'Business Website Address (if applicable):',
    },
    businessImpactStatement: {
      label: 'How has your business been impacted?',
      hint: (
        <p>
          Please provide a short written statement setting out how your business
          has been severely impacted by the Covid-19 Omicron variant. This
          should include details on why and how your business has been severely
          impacted, the scale of your coronavirus related losses (e.g % drop in
          sales, loss of income in £s), and any ongoing monthly fixed business
          costs your business pays e.g rent, bills.
        </p>
      ),
      validation: {
        required: true,
      },
      adminValidation: true,
    },
  },
  contact: {
    firstName: {
      label: 'First Name:',
      validation: {
        required: 'First Name is required',
      },
      adminValidation: true,
    },
    lastName: {
      label: 'Last Name:',
      validation: {
        required: 'Last Name is required',
      },
      adminValidation: true,
    },
    emailAddress: {
      label: 'Email Address:',
      validation: {
        required: 'Email Address is required',
      },
      type: 'email',
    },
    telephoneNumber: {
      label: 'Contact Telephone Number:',
      type: 'tel',
      validation: {
        required: true,
        pattern: {
          value: /^[0-9]*$/,
          message: 'Telephone Number must be a number',
        },
      },
    },
    address: { label: 'Applicant Address:' },
    dateOfBirth: {
      label: 'Date of Birth (Only required for Sole Traders):',
      validation: {
        validate: {
          valid: (value) =>
            value && (isValid(new Date(value)) || 'Must be a valid Date'),
          past: (value) =>
            value && (isPast(new Date(value)) || 'Must be a past Date'),
        },
      },
    },
  },
  businessBankAccount: {
    bankName: {
      label: 'Bank Name:',
      validation: { required: 'Bank Name is required' },
    },
    accountHolder: {
      label: 'Account Holder Name:',
      validation: { required: 'Account Holder Name is required' },
      adminValidation: true,
    },
    accountNumber: {
      inputClassName: 'govuk-input--width-10',
      label: 'Account Number:',
      inputMode: 'numeric',
      validation: {
        required: 'Account Number is required',
        pattern: {
          value: /^[0-9]{8}$/,
          message: 'Account Number must be a 8 digit number',
        },
      },
      adminValidation: true,
    },
    accountSortcode: {
      inputClassName: 'govuk-input--width-5',
      label: 'Sort Code:',
      inputMode: 'numeric',
      validation: {
        required: 'Sort Code is required',
        pattern: {
          value: /^[0-9]{6}$/,
          message: 'Sort Code must be a 6 digit number',
        },
      },
      adminValidation: true,
    },
  },
  supplementaryInformation: {
    bankStatement: {
      label: 'Business Bank Statement:',
      hint: `Please provide your December 2021 business bank statement - this must correspond with the bank account details provided in this application form. If you do not have your December 2021 bank statement, please submit your most recent bank statement.`,
      validation: {
        validate: (value) => value.length > 0 || 'Document required',
      },
    },
  },
  declaration: {
    name: {
      label: 'Full Name of person making this declaration:',
      validation: { required: true },
    },
    contactTypeId: {
      label: 'Role/position in organisation:',
      options: options.CONTACT_TYPE,
      validation: {
        required: 'Role/position in organisation is required',
        validate: (value) => value !== '',
      },
    },
    contactTypeIdText: {},
    authoriseOnBehalf: {
      label:
        'I confirm that I am authorised to submit this form on behalf of the business',
      validation: { required: true },
    },
    businessMeetsCriteria: {
      label: `I declare that the business meets the eligibility criteria for the Omicron Hospitality and Leisure Grant that I am applying for and that the information I have provided is complete and accurate.`,
      validation: { required: true },
    },
    businessIWillInform: {
      label: (
        <>
          I confirm that I will inform Hackney Council if;
          <ul>
            <li>
              My business no longer occupies the premises stated in this
              application form.
            </li>
            <li>
              My business ceases trading permanently, or goes into
              administration, becomes insolvent, or is in receipt of a striking
              off notice.
            </li>
          </ul>
        </>
      ),
      validation: { required: true },
    },
    businessNotExceedPermittedAllowance: {
      label: (
        <>
          I confirm that I have read the{' '}
          <a
            href="https://drive.google.com/file/d/1--cmWYpNzr0SX6dkkbiXDocXIoEuKuQc/view"
            target="_blank"
            rel="noopener"
          >
            subsidy allowance guidance document
          </a>{' '}
          and my business has not exceeded the permitted subsidy allowance.
        </>
      ),
      validation: { required: true },
    },
    businessRecoverableAgreement: {
      label:
        'I understand that if the grant is paid in error it will be recoverable from the recipient.',
      validation: { required: true },
    },
    businessPermitData: {
      label:
        'I permit the data provided in this form to be used to determine my eligibility and process my application for the Omicron Hospitality and Leisure Grant. I understand that my data will be kept on record and may be used to determine my eligibility for any future rounds of Covid-19 business grants where applicable.',
      validation: { required: true },
    },
    businessShareWithBEIS: {
      label: (
        <>
          I confirm that I am happy for my data to be shared with{' '}
          <a
            href="https://www.gov.uk/government/organisations/department-for-business-energy-and-industrial-strategy"
            target="_blank"
            rel="noopener"
          >
            BEIS
          </a>{' '}
          in accordance with the{' '}
          <a
            href="https://www.gov.uk/government/publications/covid-19-grant-schemes-privacy-notice/covid-19-grant-schemes-privacy-notice"
            target="_blank"
            rel="noopener"
          >
            BEIS Privacy Notice
          </a>
          .
        </>
      ),
      validation: { required: true },
    },
    businessHappyContacted: {
      label: `I confirm that I am happy to be contacted by Hackney Council in the future for details of new business funding opportunities and in relation to other business initiatives.`,
    },
  },
};

export const getInputProps = (
  form,
  name,
  { register, control } = {},
  errors
) => {
  // filtering out adminValidation
  // eslint-disable-next-line no-unused-vars
  const { validation, ...props } = inputLabels[form][name] || {};
  return {
    name: `${form}.${name}`,
    ...props,
    register: validation && register ? register(validation) : register,
    control: control,
    rules: control && validation,
    error: errors && errors[form] && errors[form][name],
  };
};
