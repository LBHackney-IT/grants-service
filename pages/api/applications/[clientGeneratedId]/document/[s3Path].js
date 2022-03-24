/* eslint-disable no-case-declarations */
import * as HttpStatus from 'http-status-codes';
import { readStream } from '../../../../../lib/usecases/getDocumentReadStream';
import { mimeType } from '../../../../../utils/mimeTypes';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const s3Path = req.query.s3Path;
      const filename = s3Path.split('/').slice(-1)[0];
      const fileType = mimeType(s3Path);

      try {
        const readableObject = readStream({ s3Path });
        console.log(readableObject);
        res.setHeader('Content-Type', fileType);
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + filename
        );

        readableObject.pipe(res);
      } catch (error) {
        console.log('Document download error:', error);
        res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        res.end(JSON.stringify('Unable to create a signed s3 document url'));
      }
      break;

    default:
      res.statusCode = HttpStatus.BAD_REQUEST;
      res.end(JSON.stringify('Invalid request method'));
  }
};
