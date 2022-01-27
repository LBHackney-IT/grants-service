import * as HttpStatus from 'http-status-codes';
import getSecureUploadUrl from '../../../lib/usecases/getSecureUploadUrl';

export default async (req, res) => {
  try {
    const { clientGeneratedId, fileName } = req.body;
    console.log(req.body);
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
    res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    res.end();
  }
};
