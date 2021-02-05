import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, TextInput, Select, Radios, TextArea } from 'components/Form';
import { stepPath, getInputProps } from 'components/Steps';
import AddressLookup from 'components/Form/AddressLookup/AddressLookup';
import { FREE_TEXT } from '../../lib/dbMapping';

import ErrorSummary from '../ErrorSummary/ErrorSummary';
import { fetchPreviousApplicationId } from '../../utils/api/applications';

const businessIdentifyNumber = (businessType) => {
  switch (businessType) {
    case 'Company Number':
      return 'businessIdentifyNumberCompanyNumber';
    case 'VAT Registration Number':
      return 'businessIdentifyNumberVAT';
    case 'National Insurance Number':
      return 'businessIdentifyNumberNIN';
    case 'Unique Taxpayer Reference':
      return 'businessIdentifyNumberUTR';
    default:
      return 'businessIdentifyNumber';
  }
};

const Step1 = (props) => {
  const [data, setData] = useState();
  const { register, handleSubmit, errors, watch } = useForm({
    defaultValues: props.formData,
  });
  const onSubmit = (data) => {
    props.saveData(data);
    Router.push(stepPath, props.nextStep);
  };
  const businessIdentifyType = watch('business.businessIdentifyType');
  const selectedBusinessStructure = watch('business.businessStructure');
  const selectedBusinessPremisesDescription = watch(
    'business.businessPremisesDescription'
  );
  const hasPreviouslyApplied = watch('business.previouslyApplied');
  const hasPreviousApplicationId = watch('business.previousApplicationId');

  useEffect(() => {
    let mounted = true;

    (async function anyNameFunction() {
      try {
        const response = await fetchPreviousApplicationId(
          hasPreviousApplicationId
        );

        if (mounted) setData(response.application);
        // eslint-disable-next-line no-empty
      } catch {}
    })();

    return () => (mounted = false);
  }, [hasPreviousApplicationId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="govuk-form-group">
        <fieldset
          className="govuk-fieldset"
          role="group"
          aria-describedby="step-hint"
        >
          <h1>Business Details</h1>
          <Radios
            {...getInputProps(
              'business',
              'previouslyApplied',
              {
                register,
              },
              errors
            )}
          />
          {hasPreviouslyApplied === 'Yes' && (
            <TextInput
              {...getInputProps(
                'business',
                'previousApplicationId',
                { register },
                errors
              )}
            />
          )}
          <Radios
            {...getInputProps(
              'business',
              'liableForRates',
              {
                register,
              },
              errors
            )}
          />
          <Radios
            {...getInputProps(
              'business',
              'businessSizeId',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'howManyEmployees',
              {
                register,
              },
              errors
            )}
          />
          <Select
            {...getInputProps(
              'business',
              'businessCategory',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessReferenceNumber',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessDescription',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps('business', 'businessName', { register }, errors)}
          />
          <TextInput
            {...getInputProps(
              'business',
              'registeredName',
              { register },
              errors
            )}
          />
          <Select
            {...getInputProps(
              'business',
              'businessStructure',
              { register },
              errors
            )}
          />
          {FREE_TEXT.includes(selectedBusinessStructure) && (
            <TextInput
              {...getInputProps(
                'business',
                'businessStructureText',
                {
                  register,
                },
                errors
              )}
            />
          )}
          <Select
            {...getInputProps(
              'business',
              'businessIdentifyType',
              { register },
              errors
            )}
          />
          {businessIdentifyType && (
            <TextInput
              {...getInputProps(
                'business',
                businessIdentifyNumber(businessIdentifyType),
                { register },
                errors
              )}
              name="business.businessIdentifyNumber"
              error={errors.business?.businessIdentifyNumber}
            />
          )}
          <TextInput
            {...getInputProps(
              'business',
              'businessRatesAccountNumber',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessRatesPayer',
              { register },
              errors
            )}
          />
          <AddressLookup
            {...getInputProps(
              'business',
              'businessTradingAddress',
              { register },
              errors
            )}
          />
          <AddressLookup
            {...getInputProps(
              'business',
              'businessAddress',
              { register },
              errors
            )}
          />
          <Select
            {...getInputProps(
              'business',
              'businessPremisesDescription',
              { register },
              errors
            )}
          />
          {FREE_TEXT.includes(selectedBusinessPremisesDescription) && (
            <TextInput
              {...getInputProps(
                'business',
                'businessPremisesText',
                {
                  register,
                },
                errors
              )}
            />
          )}
          <TextInput
            {...getInputProps(
              'business',
              'tradingDaysPerWeek',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessRateableValue',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessWebsite',
              { register },
              errors
            )}
          />
          <TextArea
            {...getInputProps(
              'business',
              'businessImpactStatement',
              { register },
              errors
            )}
          />
          {(data || hasPreviouslyApplied === 'No') && (
            <Button className="govuk-button" text="Next" type="submit" />
          )}
          {hasPreviouslyApplied === 'Yes' && !data && (
            <ErrorSummary
              title="Unfortunately, your previous application was not found."
              body="Check your previous submitted application ID is correct."
            />
          )}
        </fieldset>
      </div>
    </form>
  );
};

export default Step1;
