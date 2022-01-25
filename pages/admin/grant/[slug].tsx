import { useRouter } from 'next/router';
import ApplicationsList from '../../../components/ApplicationsList/ApplicationsList';
import { getGrantBySlug } from '../../../grants/grants';
import { redirectIfNotAuth } from '../../../utils/auth';

const AdminManageGrantPage = (props) => {
  const { query } = useRouter();

  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;

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
            <a
              className="govuk-breadcrumbs__link"
              href={`/admin/grant/${slug}`}
            >
              {grant.name}
            </a>
          </li>
        </ol>
      </div>

      <span className="govuk-caption-xl">Hello {props.name}</span>
      <h1 className="govuk-heading-xl">{grant.name}</h1>

      <ApplicationsList {...props} grantType={slug} grantName={grant.name} />
    </>
  );
};

export const getServerSideProps = redirectIfNotAuth;

export default AdminManageGrantPage;
