import * as HttpStatus from 'http-status-codes';
import getSecureUploadUrl from '../../../lib/usecases/getSecureUploadUrl';
import { fileTypeFromFile } from 'file-type';
import { IncomingForm } from 'formidable';

const allowedMimes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats',
  'officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { clientGeneratedId, fileName } = data.fields;
    const fileType = await fileTypeFromFile(data?.files?.file.filepath);

    if (fileType && !allowedMimes.includes(fileType.mime))
      throw new Error('Disallowed mime type');

    const { documentId, fields, url } = await getSecureUploadUrl(
      clientGeneratedId,
      fileName
    );

    const fileKey = `${clientGeneratedId}/${documentId}/${fileName}`;
    res.statusCode = HttpStatus.OK;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        fileKey,
        url,
        fields: {
          key: fileKey,
          ...fields,
          'X-Amz-Server-Side-Encryption': 'AES256',
          'X-Amz-Meta-Description': clientGeneratedId,
        },
      })
    );
  } catch (error) {
    console.log(error);
    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    res.end();
  }
};
