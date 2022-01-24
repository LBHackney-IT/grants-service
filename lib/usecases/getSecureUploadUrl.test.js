import getSecureUploadUrl from './getSecureUploadUrl';

describe('get secure upload URL usecase', () => {
  let initialEnv;
  beforeEach(() => {
    initialEnv = {
      ...process.env,
    };
  });

  afterEach(() => {
    process.env = initialEnv;
  });

  it('should use local filesystem gateway if the ENV environment variable is "local"', async () => {
    process.env.ENV = 'local';

    await expect(getSecureUploadUrl('dropbox-id', 'filename')).resolves.toEqual(
      {
        documentId: expect.any(String),
        url: expect.stringMatching(
          /\/api\/local-file-upload\/dropbox-id\/.*?\/filename/
        ),
        fields: {},
      }
    );
  });

  it('should use the S3 if the ENV environment variable is anything other than "local"', async () => {
    process.env.ENV = 'production';

    await expect(getSecureUploadUrl('dropbox-id', 'filename')).resolves.toEqual(
      {
        documentId: expect.any(String),
        url: expect.stringContaining('https://s3.amazonaws.com/'),
        fields: expect.any(Object),
      }
    );
  });
});
