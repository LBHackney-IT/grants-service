/**
 * Gateway that provides documents that belong to dropboxes from Amazon S3.
 */
export default () => {
  /**
   * Creates a URL that can be used to upload a new document to the dropbox.
   * @param {String} dropboxId the id of the dropbox
   * @param {String} documentId the id of the new document
   */
  function createUploadUrl(dropboxId, documentId, fileName) {
    console.log('Generating pre-signed upload url', { dropboxId, documentId });

    return {
      url: `/api/local-file-upload/${dropboxId}/${documentId}/${fileName}`,
      fields: {},
    };
  }

  function getDownloadUrl(key) {
    console.log('Generating pre-signed download url', { key });

    return `/public/uploads/${key}`;
  }

  return {
    createUploadUrl,
    getDownloadUrl,
  };
};
