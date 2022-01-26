import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, Radios } from '../../Form';
import { getInputProps } from './index';
import { inputLabels } from './index';
import ErrorSummary from '../../ErrorSummary/ErrorSummary';

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
        !sectionQuestions[key].validAnswer ||
        value !== sectionQuestions[key].validAnswer
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
            'isEligibleForArg',
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
        <Radios
          {...getInputProps(
            'eligibilityCriteria',
            'businessIsTrading',
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
