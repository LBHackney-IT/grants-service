import React from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';

import { Button, TextInput, Select } from 'components/Form';
import { stepPath, stepKeys } from 'components/Steps';

const Step1 = props => {
  const { register, handleSubmit } = useForm({ defaultValues: props.formData });
  const onSubmit = data => {
    props.saveData(data);
    Router.push(stepPath, props.nextStep);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Your Details</h1>
      <Select
        label="Authority:"
        name="authority"
        options={['PSC', 'Trustee', 'Agent', 'Owner', 'Partner', 'Employee']}
        register={register({ required: true })}
      />
      <TextInput
        label="First Name:"
        name="firstName"
        register={register({ required: true })}
      />
      <TextInput
        label="Last Name:"
        name="lastName"
        register={register({ required: true })}
      />
      <TextInput
        label="Email Address:"
        name="email"
        type="email"
        register={register({ required: true })}
      />
      <TextInput
        label="Telephone Number:"
        name="tel"
        type="tel"
        register={register}
      />
      <TextInput label="Address:" name="address" register={register} />
      <Button className="govuk-button" text="Next" type="submit" />
    </form>
  );
};

export default Step1;