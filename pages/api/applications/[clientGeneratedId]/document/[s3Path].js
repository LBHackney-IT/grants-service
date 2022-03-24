/* eslint-disable no-case-declarations */
import * as HttpStatus from 'http-status-codes';
import { signedUrl } from '../../../../../lib/usecases/getSignedDocumentUrl';
import fetch from 'node-fetch';
import { mimeType } from '../../../../../utils/mimeTypes';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const s3Path = req.query.s3Path;
      const filename = s3Path.split('/').slice(-1)[0];
      const fileType = mimeType(s3Path);

      try {
        const url = await signedUrl({ s3Path });

        const response = await fetch(url);

        if (!response.ok)
          throw new Error(`unexpected response ${response.statusText}`);

        res.setHeader('Content-Type', fileType);
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + filename
        );

        res.send(response.body);
      } catch (error) {
        console.log('Document Signed URL error:', error, 'request:', req);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.end(JSON.stringify('Unable to create a signed s3 document url'));
      }
      break;

    default:
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.end(JSON.stringify('Invalid request method'));
  }
};
