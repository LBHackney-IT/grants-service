import { useRouter } from 'next/router';

import { redirectIfNotAuth } from '../../../../../utils/auth';
import ApplicationView from '../../../../../components/ApplicationView/ApplicationView';
import { getGrantBySlug } from '../../../../../grants/grants';

const ApplicationViewPage = () => {
  const { query } = useRouter();
  const { clientGeneratedId, ...queryParameters } = query;

  const slug = Array.isArray(queryParameters.slug)
    ? queryParameters.slug[0]
    : queryParameters.slug;

  const grant = getGrantBySlug(slug);

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
