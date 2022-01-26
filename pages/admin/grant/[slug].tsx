import { useRouter } from 'next/router';
import { useState } from 'react';
import ApplicationsList from '../../../components/ApplicationsList/ApplicationsList';
import { getGrantBySlug } from '../../../grants/grants';
import { patchApplications } from '../../../utils/api/applications';
import { redirectIfNotAuth } from '../../../utils/auth';

const AdminManageGrantPage = (props) => {
  const { query } = useRouter();
  const [error, setError] = useState();

  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;

  const grant = getGrantBySlug(slug);

  const canDownloadCsvs = props.groups.includes(props.csvDownloadGroup);

  const handleCsvDownload = async (e) => {
    try {
      setError(null);
      const round = e.target.getAttribute('round');
      const csv = await patchApplications({ round });
      window.open(encodeURI(`data:text/csv;charset=utf-8,${csv}`));
    } catch (e) {
      e.response.status = 400;
      setError(e.response.data);
    }
  };

  return (
    <>
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href="/admin">
              Manage grant applications
            </a>
          </li>
          <li className="govuk-breadcrumbs__list-item">{grant.name}</li>
        </ol>
      </div>

      <span className="govuk-caption-xl" data-testid="admin-page-subheading">
        Hello {props.name}
      </span>
      <h1 className="govuk-heading-xl">{grant.name}</h1>

      <ApplicationsList {...props} grantType={slug} grantName={grant.name} />

      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      <h1 className="govuk-heading-m">Data export</h1>

      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          Search terms or filters will not apply to the CSV download
        </strong>
      </div>

      <a
        href={`/api/csv/applications?grantType=${slug}`}
        target="_blank"
        role="button"
        draggable="false"
        className="govuk-button"
        data-module="govuk-button"
      >
        Download all applications as a CSV
      </a>

      {canDownloadCsvs && (
        <>
          <h1 className="govuk-heading-s">Payment details</h1>
          <div>
            <div>
              <button
                className="govuk-button govuk-button--secondary govuk-!-margin-right-1"
                data-module="govuk-button"
                onClick={handleCsvDownload}
              >
                Export Panel Approved Payments
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const getServerSideProps = redirectIfNotAuth;

export default AdminManageGrantPage;
