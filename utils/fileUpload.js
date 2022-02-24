import axios from 'axios';

const fileUploader = async (file, clientGeneratedId) => {
  //Pretends to upload the file, this is used for local testing
  //return 'faked_it_out_for_local_testing.ext';
  const fileData = new FormData();
  fileData.append('file', file);
  fileData.append('clientGeneratedId', clientGeneratedId);
  fileData.append('fileName', file.name);

  const { data } = await axios.post('/api/urls', fileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const formData = new FormData();
  Object.entries(data.fields).forEach(([key, value]) =>
    formData.append(key, value)
  );
  formData.append('file', file);
  await axios.post(data.url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.fileKey;
};

export default fileUploader;
