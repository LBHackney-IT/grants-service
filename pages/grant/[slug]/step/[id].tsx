import React from 'react';
import { useRouter } from 'next/router';

import { getGrantBySlug } from '../../../../grants/grants';

const GrantStep: React.FC = () => {
  const { query } = useRouter();

  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

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

export const getServerSideProps = () => {
  return {
    props: {},
  };
};

export default GrantStep;
