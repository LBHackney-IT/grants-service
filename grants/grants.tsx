import React, { ReactElement } from 'react';
import { NotFoundError } from '../utils/errors';
import { steps as ohlgSteps } from '../components/Steps/omicron-hospitality-leisure-grant';
import { steps as argSteps } from '../components/Steps/additional-restrictions-grant';

export type Grant = {
  name: string;
  description: ReactElement;
  steps: {
    [key: string]: () => ReactElement;
  };
};

const grants: Map<string, Grant> = new Map([
  [
    'arg',
    {
      name: 'Omicron Additional Restrictions Grant',
      description: (
        <>
          <p>Additional Restrictions Grant Round 3</p>
        </>
      ),
      steps: argSteps,
    },
  ],
  [
    'ohlg',
    {
      name: 'Omicron Hospitality and Leisure Grant',
      description: (
        <>
          <p>Omicron Hospitality and Leisure Grant</p>
        </>
      ),
      steps: ohlgSteps,
    },
  ],
]);

export const getGrantBySlug = (slug: string): Grant => {
  if (!grants.has(slug)) {
    throw new NotFoundError(`Unable to find a grant with the slug ${slug}`);
  }

  return grants.get(slug);
};
