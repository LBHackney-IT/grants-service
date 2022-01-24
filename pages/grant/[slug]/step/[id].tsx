import React, { useState } from 'react';
import { Router, useRouter } from 'next/router';
import { useBeforeunload } from 'react-beforeunload';
import ErrorPage from 'next/error';

import { getGrantBySlug } from '../../../../grants/grants';
import { GetServerSideProps } from 'next';
import { convertErrorToStatusCode } from '../../../../utils/errors';
import { stepKeys } from '../../../../components/Steps';
import Link from 'next/link';

const GrantStep: React.FC<{ slug: string; statusCode: number }> = ({
  slug,
  statusCode = 200,
}) => {
  const { query } = useRouter();

  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  if (statusCode >= 400) {
    return <ErrorPage statusCode={statusCode} />;
  }

  const grant = getGrantBySlug(slug);

  return (
    <>
      <h1 data-testid="page-heading">{grant.name}</h1>

      {grant.description}

      <FormWizard grantSlug={slug} grant={grant} stepId={id} />
    </>
  );
};

const FormWizard = ({ grant, grantSlug, stepId }) => {
  const [formData, setFormData] = useState<any>({});
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
    // typeof window !== 'undefined' && Router.push(`/step/${firstStep}`);
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;

  try {
    getGrantBySlug(slug);

    return {
      props: {
        slug,
      },
    };
  } catch (error) {
    const statusCode = convertErrorToStatusCode(error);

    res.statusCode = statusCode;

    return {
      props: {
        statusCode,
      },
    };
  }
};

export default GrantStep;
