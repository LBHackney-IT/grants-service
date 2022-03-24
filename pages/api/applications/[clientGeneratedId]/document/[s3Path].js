/* eslint-disable no-case-declarations */
import * as HttpStatus from 'http-status-codes';
import { signedUrl } from '../../../../../lib/usecases/getSignedDocumentUrl';
import request from 'request';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const s3Path = req.query.s3Path;

      try {
        const url = await signedUrl({ s3Path });
        return request.get(url).pipe(res);
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
