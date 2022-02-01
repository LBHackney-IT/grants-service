import { redirectIfNotAuth } from '../../utils/auth';

const AdminPage = ({ name }) => {
  return (
    <>
      <span className="govuk-caption-xl">Hello {name}</span>
      <h1 className="govuk-heading-xl">Manage grant applications</h1>

      <GrantPanel
        name="Omicron Hospitality and Leisure Grant"
        summary=" "
        slug="ohlg"
      />

      <GrantPanel
        name="Omicron Additional Restrictions Grant"
        summary=" "
        slug="arg"
      />
    </>
  );
};

const GrantPanel = ({ name, summary, slug }) => {
  return (
    <>
      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-three-quarters">
          <h2 className="govuk-heading-m">{name}</h2>
          <p className="govuk-body">{summary}</p>
        </div>
        <div className="govuk-grid-column-one-quarter">
          <a
            href={`/admin/grant/${slug}`}
            role="button"
            draggable="false"
            className="govuk-button govuk-button--start govuk-!-margin-top-3"
            data-module="govuk-button"
          >
            Start now
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = redirectIfNotAuth;

export default AdminPage;
