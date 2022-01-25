import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, TextInput } from '../Form';
import { getInputProps } from './index';

const BankDetails = (props) => {
  const { register, errors, handleSubmit } = useForm({
    defaultValues: props.formData,
  });
  const onSubmit = (data) => {
    props.saveData(data);
    Router.push(props.nextStep);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Bank Details</h1>
      <div className="govuk-inset-text">
        The bank details provided below must correspond with the bank statement
        uploaded with your application form. Please note this is the bank
        account that any grant will be paid into, so please ensure you provide
        the correct details. Where possible, the bank account details provided
        should be your business bank account rather than your personal bank
        account.
      </div>
      <TextInput
        {...getInputProps(
          'businessBankAccount',
          'bankName',
          { register },
          errors
        )}
      />
      <TextInput
        {...getInputProps(
          'businessBankAccount',
          'accountHolder',
          { register },
          errors
        )}
      />
      <TextInput
        {...getInputProps(
          'businessBankAccount',
          'accountNumber',
          { register },
          errors
        )}
      />
      <TextInput
        {...getInputProps(
          'businessBankAccount',
          'accountSortcode',
          { register },
          errors
        )}
      />
      <Button className="govuk-button" text="Next" type="submit" />
    </form>
  );
};

export default BankDetails;
