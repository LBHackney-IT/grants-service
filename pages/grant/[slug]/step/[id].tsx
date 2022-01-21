import React from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import { getGrantBySlug } from '../../../../grants/grants';
import { GetServerSideProps } from 'next';
import { convertErrorToStatusCode } from '../../../../utils/errors';

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

      <dl>
        <dt>Step ID:</dt>
        <dd>{id}</dd>
      </dl>
    </>
  );
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
