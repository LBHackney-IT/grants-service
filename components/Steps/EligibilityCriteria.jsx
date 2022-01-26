import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, Radios } from '../Form';
import { getInputProps } from './index';
import { inputLabels } from './index';
import ErrorSummary from '../ErrorSummary/ErrorSummary';

const Step1 = (props) => {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: props.formData,
  });
  const [showError, setShowError] = useState(false);
  const onSubmit = (data) => {
    let eligible = true;
    const sectionQuestions = inputLabels.eligibilityCriteria;

    Object.entries(data.eligibilityCriteria).forEach(([key, value]) => {
      if (
        value != sectionQuestions[key].validAnswer ||
        !sectionQuestions[key].validAnswer
      ) {
        eligible = false;
      }
    });

    setShowError(!eligible);

    if (eligible) {
      props.saveData(data);
      Router.push(props.nextStep);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className="govuk-fieldset"
        role="group"
        aria-describedby="step-hint"
      >
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading" data-testid="step-heading">
            Eligibility Criteria
          </h1>
        </legend>
        <span id="step-hint" className="govuk-hint">
          <p>
            Before making your application please follow this link to check your
            eligibility for this grant. <h3>(link to website information)</h3>A
            separate application form is required if you are applying for the
            grant across multiple premises.
          </p>

          <p>
            The Government or the Council will not accept deliberate
            manipulation and fraud. Any business caught falsifying their records
            to gain additional grant money will face prosecution and any funding
            issued will be subject to clawback. As will any grants paid in
            error.
          </p>

          <p>
            We will use your information to assess your application for
            financial support. In doing so we may confirm information about you
            and your account from Council departments and credit reference
            agencies to confirm account validity and your identity. If you
            provide false or inaccurate information, we will record this. If you
            would like full details on how we use your information, please refer
            to our{' '}
            <a href="https://hackney.gov.uk/privacy" target="_blank">
              privacy statement
            </a>
            .
          </p>
        </span>
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'tradingInHackney',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'liableForBusinessRates',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'businessSectorEligible',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'eligibleForOhlg',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'servedLegalNotices',
            {
              register,
            },
            errors
          )}
          onChange={() => setShowError(false)}
        />
      </fieldset>
      {showError && (
        <ErrorSummary
          title="Unfortunately you are not eligible for this grant."
          body="The information provided does not meet the specified requirements."
        />
      )}
      {!showError && (
        <Button className="govuk-button" text="Next" type="submit" />
      )}
    </form>
  );
};

export default Step1;
