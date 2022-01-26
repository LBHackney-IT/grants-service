import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, TextInput, Select, Radios, DateInput } from '../../Form';
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
  const isBusinessStillTrading = watch('business.isBusinessStillTrading');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="govuk-form-group">
        <fieldset
          className="govuk-fieldset"
          role="group"
          aria-describedby="step-hint"
        >
          <h1 data-testid="step-heading">Business Details</h1>
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
              'highLevelSicCode',
              { register },
              errors
            )}
          />
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
              'businessRatesPropertyReferenceNumber',
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
              'businessSector',
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
          <Radios
            {...getInputProps(
              'business',
              'isBusinessStillTrading',
              {
                register,
              },
              errors
            )}
          />
          {isBusinessStillTrading == 'No' && (
            <DateInput
              {...getInputProps(
                'business',
                'isBusinessStillTradingDateStopped',
                { control },
                errors
              )}
            />
          )}
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
          <Button className="govuk-button" text="Next" type="submit" />
        </fieldset>
      </div>
    </form>
  );
};

export default Step1;
