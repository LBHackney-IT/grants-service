import jwt from 'jsonwebtoken';
import { redirectIfNotAuth } from './auth';

describe('auth util', () => {
  const initialEnv = {
    ...process.env,
  };

  afterEach(() => {
    process.env = initialEnv;
  });

  describe('#redirectIfNotAuth()', () => {
    it('should return a correctly structured props object', async () => {
      process.env.CSV_DOWNLOAD_GROUP = 'some-download-group';
      process.env.HACKNEY_JWT_SECRET = 'secret';

      const hackneyToken = jwt.sign(
        {
          some: 'user-data',
        },
        'secret'
      );

      const response = await redirectIfNotAuth({
        req: {
          headers: {
            cookie: `hackneyToken=${hackneyToken}`,
          },
        },
        query: {
          pass: 'along',
        },
      });

      expect(response).toEqual({
        props: {
          csvDownloadGroup: 'some-download-group',
          some: 'user-data',
          pass: 'along',
          iat: expect.any(Number),
        },
      });
    });

    it('should return a redirect object if there is an error parsing the token', async () => {
      process.env.CSV_DOWNLOAD_GROUP = 'some-download-group';
      process.env.HACKNEY_JWT_SECRET = 'secret';
      process.env.HTTPS_ENABLED = 'true';
      process.env.APP_DOMAIN = 'app.hackney.gov.uk';
      process.env.HACKNEY_AUTH_URL = 'https://auth.hackney.gov.uk';

      const hackneyToken = 'not-a-valid-token';

      const response = await redirectIfNotAuth({
        req: {
          headers: {
            cookie: `hackneyToken=${hackneyToken}`,
          },
          url: '/path',
        },
        query: {},
      });

      expect(response).toEqual({
        props: {},
        redirect: {
          permanent: false,
          destination:
            'https://auth.hackney.gov.uk?redirect_uri=https://app.hackney.gov.uk/path',
        },
      });
    });
  });
});
