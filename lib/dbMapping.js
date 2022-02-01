// options references in db/seeds.sql

export const GRANT_AMOUNT = {
  ohlg: ['0.00', '2677.00', '4000.00', '6000.00', 'Other'],
  arg: ['2000.00', '2667.00', '3000.00', '4000.00', '6000.00', 'Other'],
};

// TODO: Remove duplication
export const BUSINESS_SIZE = ['Micro', 'Small'];
export const VALID_BUSINESS_SIZE = ['Micro', 'Small'];
export const ALL_BUSINESS_SIZES = [
  '0-9 (Micro)',
  '10-49 (Small)',
  '50-249 (Medium)',
  '250+ (Large)',
];

export const SMALL_BUSINESS_SIZES = ['0-9 (Micro)', '10-49 (Small)'];

export const HOSPITALITY_LEISURE_BUSINESS_TYPES = [
  'Hospitality',
  'Leisure',
  'Accommodation',
];

export const TYPE_OF_BUSINESS = [
  'Individual office',
  'Individual shop unit',
  'Market Stall',
  'Office/business unit in a shared workspace',
  'Bed and Breakfast',
  'Hotel',
  'Nursery',
  'Residential premises (i.e your home)',
  'Other (please state):',
];

export const TYPE_IDENTIFIER_NUMBER = [
  'Company Number',
  'VAT Registration Number',
  'Self-Assessment/Partnership Number',
  'National Insurance Number',
  'Unique Taxpayer Reference',
  'Registered Charity Number',
];

export const RATEABLE_LIMIT_ANSWERS = ['Yes', 'No', 'Not Applicable'];

export const CONTACT_TYPE = [
  'Agent (Authorised to act)',
  'Owner (Sole Trader)',
  'Partner / Employee (Acting for)',
  'PSC of Registered Company (Person with significant control)',
  'Trustee (Charity)',
  'Company Director',
  'Other (please state):',
];

export const COMPANY_STRUCTURE = [
  'Charity',
  'Registered company',
  'Partnership',
  'Limited Liability Partnership',
  'Community Interest Company',
  'Social enterprise',
  'Sole trader',
  'Other (please state):',
];

export const STATE_AID_OPTION = [
  'Not Applicable',
  'Covid 19 Temporary Framework Scheme',
  'State Aid De Minimis Rule',
];

export const STATE_AID_OPTION_WITH_MORE_Q = [
  'Covid 19 Temporary Framework Scheme',
  'State Aid De Minimis Rule',
];

export const APPLICATION_STATE = {
  1: 'Unprocessed',
  2: 'Processed - Approved',
  3: 'Processed - Rejected',
  4: 'Processed - Priority 2',
  5: 'Processed - Check Bank Details',
  6: 'Refer to Manager',
  7: 'NFI',
  9: 'Closed - Duplicate',
  10: 'Declined - Test',
  11: 'Processed - Requested Information',
  12: 'OHLG Eligible',
};

export const BUSINESS_CATEGORIES = [
  'Section A: Agricultural, forestry and fishing',
  'Section B: Mining and quarrying',
  'Section C: Manufacturing',
  'Section D: Electricity, gas, steam and air conditioning supply',
  'Section E: Water supply, sewerage, waste management and remediation activities',
  'Section F: Construction',
  'Section G: Wholesale and retail trade/Repair of motor vehicles and motor cycles',
  'Section H: Transportation and storage',
  'Section I: Accommodation and food services',
  'Section J: Information and communication',
  'Section K: Financial and insurance activities',
  'Section L: Real estate activities',
  'Section M: Professional,scientific and technical activities',
  'Section N: Administrative and support services activities',
  'Section O: Public administration and defence/ Compulsory social security',
  'Section P: Education',
  'Section Q: Human health and social work activities',
  'Section R: Arts, entertainment and recreation',
  'Section S: Other service activities',
  'Section T: Activities of households as employers/ Undifferentiated goods and services producing activities of households for own use',
  'Section U: Activities of extraterritorial organisations and bodies',
];

export const DATES = {
  'Round 1': '2021-01-08',
  'Round 2': '2021-01-09',
};

export const FREE_TEXT = ['Other (please state):', 'Other'];
