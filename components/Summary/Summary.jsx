import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'next/link';

import SummaryList from '../SummaryList/SummaryList';
import ExpandableDetails from '../ExpandableDetails/ExpandableDetails';
import { getInputProps, hasAdminValidation } from '../Steps';

const MultiValue = (value) => (
  <div key={value}>
    <span>{value}</span>
    <br />
  </div>
);

export const SummarySection = ({
  formData,
  hasChangeLink,
  validationRecap,
  name,
  title,
  slug,
  register,
  isExpandable,
  grantSlug,
}) => {
  const Summary = (
    <SummaryList
      register={register}
      name={name}
      list={Object.entries(formData[name])
        .filter(([, value]) => value != null)
        .map(([key, value]) => ({
          key,
          adminValidation: hasAdminValidation(name, key),
          title: getInputProps(name, key).label,
          value: Array.isArray(value)
            ? value.filter(Boolean).map((v) => MultiValue(v.split('/').pop()))
            : typeof value === 'object'
            ? Object.values(value).filter(Boolean).map(MultiValue)
            : typeof value === 'boolean'
            ? value === true
              ? 'Yes'
              : 'No'
            : value,
        }))}
    />
  );
  return (
    <div
      className={cx({
        'govuk-!-margin-bottom-9': !isExpandable,
        'govuk-!-margin-bottom-7': isExpandable,
      })}
    >
      <h2>
        {title}{' '}
        {validationRecap &&
          validationRecap[name] !== undefined &&
          (validationRecap[name] ? (
            <strong className="govuk-tag govuk-tag--green">Validated</strong>
          ) : (
            <strong className="govuk-tag govuk-tag--yellow">Pending</strong>
          ))}
      </h2>
      {isExpandable ? (
        <ExpandableDetails>{Summary}</ExpandableDetails>
      ) : (
        Summary
      )}
      {hasChangeLink && (
        <Link href={`/grant/${grantSlug}/step/${slug}`}>
          <a className="govuk-link">Change</a>
        </Link>
      )}
    </div>
  );
};

const sections = [
  {
    name: 'eligibilityCriteria',
    title: 'Eligibility Criteria',
    slug: 'eligibility-criteria',
  },
  {
    name: 'business',
    title: 'Business details',
    slug: 'business-details',
  },
  {
    name: 'contact',
    title: 'Your details',
    slug: 'your-details',
  },
  {
    name: 'businessBankAccount',
    title: 'Bank details',
    slug: 'bank-details',
  },
  {
    name: 'supplementaryInformation',
    title: 'Supplementary Information',
    slug: 'supplementary-information',
  },
  {
    name: 'declaration',
    title: 'State Aid Declaration',
    slug: 'declaration',
  },
];

const Summary = ({ filterOut, validationRecap, ...props }) =>
  sections
    .filter((section) => !filterOut || filterOut.indexOf(section.name) === -1)
    .map((section) => (
      <SummarySection
        key={section.slug}
        validationRecap={validationRecap}
        {...props}
        {...section}
      />
    ));

Summary.propTypes = {
  formData: PropTypes.shape({}).isRequired,
  filterOut: PropTypes.arrayOf(PropTypes.string),
  isExpandable: PropTypes.bool,
  hasChangeLink: PropTypes.bool,
};

export default Summary;
