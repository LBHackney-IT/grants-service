import createGateway from '../local-filesystem';

describe('local filesystem gateway', () => {
  const gateway = createGateway();
  it('should return a local URL path to upload the file to', () => {
    expect(
      gateway.createUploadUrl('dropboxId', 'documentId', 'fileName')
    ).toEqual({
      url: '/api/local-file-upload/dropboxId/documentId/fileName',
      fields: {},
    });
  });

  it('should return a local path to download the file', () => {
    expect(gateway.getDownloadUrl('key')).toEqual('/public/uploads/key');
  });
});
