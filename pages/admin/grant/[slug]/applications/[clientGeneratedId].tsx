import { useRouter } from 'next/router';
import React from 'react';

import { redirectIfNotAuth } from '../../../../../utils/auth';
import ApplicationView from '../../../../../components/ApplicationView/ApplicationView';
import { getGrantBySlug } from '../../../../../grants/grants';

const ApplicationViewPage: React.FC = () => {
  const { query } = useRouter();

  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;

  const grant = getGrantBySlug(slug);

  const clientGeneratedId = Array.isArray(query.clientGeneratedId)
    ? query.clientGeneratedId[0]
    : query.clientGeneratedId;

  return (
    <>
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href="/admin">
              Manage grant applications
            </a>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href="/admin">
              {grant.name}
            </a>
          </li>
          <li className="govuk-breadcrumbs__list-item">Application</li>
        </ol>
      </div>

      <ApplicationView applicationId={clientGeneratedId} />
    </>
  );
};

export const getServerSideProps = redirectIfNotAuth;

export default ApplicationViewPage;
