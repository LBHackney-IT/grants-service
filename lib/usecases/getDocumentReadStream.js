import createGateway from '../gateways/s3';
import s3config from '../s3config';

const documents = createGateway({
  ...s3config,
  configuration: {
    urlPrefix: process.env.APP_DOMAIN,
    maxUploadBytes: 20971520,
  },
});

export const readStream = ({ s3Path }) => {
  return documents.getReadStream(s3Path);
};
