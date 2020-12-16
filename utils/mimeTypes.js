export const mimeType = (s3Path) => {
  let mime = 'binary/octet-stream';

  if (s3Path.endsWith('.bmp')) {
    mime = 'image/bmp';
  }
  if (s3Path.endsWith('.png')) {
    mime = 'image/png';
  }
  if (s3Path.endsWith('.jpg') || s3Path.endsWith('.jpeg')) {
    mime = 'image/jpeg';
  }
  if (s3Path.endsWith('.csv')) {
    mime = 'text/cvs';
  }
  if (s3Path.endsWith('.doc')) {
    mime = 'application/msword';
  }
  if (s3Path.endsWith('.docx')) {
    mime =
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (s3Path.endsWith('.docm')) {
    mime = 'application/vnd.ms-word.document.macroEnabled.12';
  }
  if (s3Path.endsWith('.gif')) {
    mime = 'image/gif';
  }
  if (s3Path.endsWith('.htm') || s3Path.endsWith('.html')) {
    mime = 'image/jpeg';
  }
  if (s3Path.endsWith('.msg')) {
    mime = 'application/vnd.ms-outlook';
  }
  if (s3Path.endsWith('.numbers')) {
    mime = 'application/x-iwork-numbers-sffnumbers';
  }
  if (s3Path.endsWith('.odt')) {
    mime = 'application/vnd.oasis.opendocument.text';
  }
  if (s3Path.endsWith('.pdf')) {
    mime = 'application/pdf';
  }
  if (s3Path.endsWith('.png')) {
    mime = 'image/png';
  }
  if (s3Path.endsWith('.pptx')) {
    mime =
      'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  if (s3Path.endsWith('.rtf')) {
    mime = 'application/rtf';
  }
  if (s3Path.endsWith('.tif') || s3Path.endsWith('.tiff')) {
    mime = 'image/tiff';
  }
  if (s3Path.endsWith('.txt')) {
    mime = 'text/plain';
  }
  if (s3Path.endsWith('.heic')) {
    mime = 'image/heic';
  }
  if (s3Path.endsWith('.xhtml')) {
    mime = 'application/xhtml+xml';
  }
  if (s3Path.endsWith('.xls')) {
    mime = 'application/vnd.ms-excel';
  }
  if (s3Path.endsWith('.xlsm')) {
    mime = 'application/vnd.ms-excel.sheet.macroenabled.12';
  }
  if (s3Path.endsWith('.xlsx')) {
    mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (s3Path.endsWith('.zip')) {
    mime = 'application/zip';
  }

  return mime;
};
