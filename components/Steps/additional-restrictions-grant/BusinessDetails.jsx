import { useForm } from 'react-hook-form';
import Router from 'next/router';

import {
  Button,
  TextInput,
  Select,
  Radios,
  DateInput,
  TextArea,
} from '../../Form';
import { getInputProps } from './index';
import AddressLookup from '../../Form/AddressLookup/AddressLookup';
import { FREE_TEXT } from '../../../lib/dbMapping';

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
  const { register, handleSubmit, errors, watch, control } = useForm({
    defaultValues: props.formData,
  });
  const onSubmit = (data) => {
    props.saveData(data);
    Router.push(props.nextStep);
  };
  const businessIdentifyType = watch('business.businessIdentifyType');
  const selectedBusinessStructure = watch('business.businessStructure');
  const selectedBusinessPremises = watch(
    'business.businessPremisesDescription'
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="govuk-form-group">
        <fieldset
          className="govuk-fieldset"
          role="group"
          aria-describedby="step-hint"
        >
          <h1 data-testid="step-heading">Business Details</h1>
          <Radios
            {...getInputProps(
              'business',
              'doesPayBusinessRates',
              {
                register,
              },
              errors
            )}
          />
          <Select
            {...getInputProps(
              'business',
              'businessSize',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'numberOfEmployees',
              { register },
              errors
            )}
          />
          <Select
            {...getInputProps('business', 'sicCategory', { register }, errors)}
          />
          <TextInput
            {...getInputProps(
              'business',
              'highLevelSicCode',
              { register },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessNature',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessNatureHospitality',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessTradingName',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessRegisteredName',
              {
                register,
              },
              errors
            )}
          />
          <DateInput
            {...getInputProps(
              'business',
              'dateEstablished',
              { control },
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
          {FREE_TEXT.includes(selectedBusinessPremises) && (
            <TextInput
              {...getInputProps(
                'business',
                'businessPremisesDescriptionText',
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
              'businessRateableValue',
              {
                register,
              },
              errors
            )}
          />
          <TextInput
            {...getInputProps(
              'business',
              'businessWebsite',
              {
                register,
              },
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
          <Button className="govuk-button" text="Next" type="submit" />
        </fieldset>
      </div>
    </form>
  );
};

export default Step1;
