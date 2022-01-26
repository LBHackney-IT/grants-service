import { nanoid } from 'nanoid';
import createGateway from '../gateways/s3';
import createLocalFilesystemGateway from '../gateways/local-filesystem';
import s3config from '../s3config';

const documents = createGateway({
  ...s3config,
  configuration: {
    urlPrefix: process.env.APP_DOMAIN,
    maxUploadBytes: 20971520,
  },
});

const localDocuments = createLocalFilesystemGateway();

export default async (dropboxId, fileName) => {
  const shouldUseLocalStorage = process.env.ENV === 'local' ? true : false;

  const documentsGateway = shouldUseLocalStorage ? localDocuments : documents;

  const documentId = nanoid(15);
  const uploadOptions = await documentsGateway.createUploadUrl(
    dropboxId,
    documentId,
    fileName
  );

  return { documentId, ...uploadOptions };
};
