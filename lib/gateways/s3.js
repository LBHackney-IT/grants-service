import { mimeType } from '../../utils/mimeTypes';

/**
 * Gateway that provides documents that belong to dropboxes from Amazon S3.
 */
export default ({
  client,
  bucketName,
  configuration: { urlPrefix, maxUploadBytes },
}) => {
  /**
   * Creates a URL that can be used to upload a new document to the dropbox.
   * @param {String} dropboxId the id of the dropbox
   * @param {String} documentId the id of the new document
   */
  function createUploadUrl(dropboxId, documentId, fileName) {
    console.log('Generating pre-signed upload url', { dropboxId, documentId });
    return new Promise((resolve, reject) => {
      const mime = mimeType(fileName);
      client.createPresignedPost(
        {
          Bucket: bucketName,
          Expires: 3600,
          Fields: {
            success_action_redirect: `${urlPrefix}/dropboxes/${dropboxId}`,
            'Content-Type': mime,
          },
          Conditions: [
            { bucket: bucketName },
            ['starts-with', '$key', `${dropboxId}/${documentId}/`],
            { 'X-Amz-Server-Side-Encryption': 'AES256' },
            ['starts-with', '$X-Amz-Meta-Description', ''],
            ['content-length-range', 1, maxUploadBytes],
          ],
        },
        (err, data) => {
          if (err) {
            console.log('Failed generating pre-signed upload url', {
              error: err,
            });

            return reject(err);
          }

          return resolve(data);
        }
      );
    });
  }

  function getDownloadUrl(key) {
    console.log('Generating pre-signed download url', { key });
    return client.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: 10,
    });
  }

  return {
    createUploadUrl,
    getDownloadUrl,
  };
};
