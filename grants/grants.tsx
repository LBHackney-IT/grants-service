import { ReactElement } from 'react';
import { NotFoundError } from '../utils/errors';

export type Grant = {
  name: string;
  description: ReactElement;
};

const grants: Map<string, Grant> = new Map([
  [
    'arg-3',
    {
      name: 'Additional Restrictions Grant – Round 3',
      description: (
        <>
          <p>
            This is the JSX-based <strong>description</strong> for ARG Round 3
          </p>
        </>
      ),
    },
  ],
  [
    'ohlg',
    {
      name: 'Omicron Hospitality and Leisure Grant',
      description: (
        <>
          <p>
            This is the JSX-based <strong>description</strong> for OHLG
          </p>
        </>
      ),
    },
  ],
]);

export const getGrantBySlug = (slug: string): Grant => {
  if (!grants.has(slug)) {
    throw new NotFoundError(`Unable to find a grant with the slug ${slug}`);
  }

  return grants.get(slug);
};
