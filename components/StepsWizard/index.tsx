import { useState } from 'react';
import Router from 'next/router';
import { useBeforeunload } from 'react-beforeunload';
import { stepKeys } from '../Steps';
import Link from 'next/link';

const StepsWizard = ({ grant, grantSlug, stepId }) => {
  const [formData, setFormData] = useState<any>({ grantType: grantSlug });
  const [isSubmitted, setIsSubmitted] = useState(false);

  Router.events.on('routeChangeComplete', () => {
    window.scrollTo(0, 0);
  });

  useBeforeunload(() => "You'll lose your data!");

  const firstStep = stepKeys[0];

  if (
    stepId &&
    !isSubmitted &&
    !formData.eligibilityCriteria &&
    stepId !== firstStep
  ) {
    typeof window !== 'undefined' &&
      Router.push(`/grant/${grantSlug}/step/${firstStep}`);
    return null;
  }

  const Step = grant.steps[stepId];

  if (!Step) {
    return null;
  }

  const { previousStep, nextStep } = getAdjacentSteps(stepId, grantSlug);

  return (
    <div className="govuk-width-container">
      {previousStep && !isSubmitted && (
        <Link href={previousStep}>
          <a className="govuk-back-link">Back</a>
        </Link>
      )}
      <main className="govuk-main-wrapper">
        <Step
          formData={formData}
          saveData={(data) => setFormData({ ...formData, ...data })}
          nextStep={nextStep}
          clearFormData={() => {
            setIsSubmitted(true);
            setFormData({});
          }}
        />
      </main>
    </div>
  );
};

export default StepsWizard;

const getAdjacentSteps = (step, grantSlug) => {
  const currentStep = stepKeys.findIndex((s) => s === step);
  return {
    previousStep:
      currentStep > 0
        ? `/grant/${grantSlug}/step/${stepKeys[currentStep - 1]}`
        : null,
    nextStep:
      currentStep < stepKeys.length
        ? `/grant/${grantSlug}/step/${stepKeys[currentStep + 1]}`
        : null,
  };
};
