import { useState, useEffect, useRef } from 'react';
import cx from 'classnames';

import { Controller } from 'react-hook-form';

import fileUploader from '../../utils/fileUpload';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import DeleteIcon from '../Icons/DeleteIcon';

const FileUpload = ({
  label,
  hint,
  name,
  inputRef,
  uploadPrefix = 'test',
  defaultValue = [],
  error: { message: errorMessage } = {},
  onChange,
}) => {
  const [value, setValue] = useState();
  const [fileList, setFileList] = useState(defaultValue);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setError(false);
      const fileKey = await fileUploader(file, uploadPrefix);
      setFileList([...fileList, fileKey]);
    } catch (e) {
      setError('There was a problem uploading the file.');
    }
    setValue('');
    setUploading(false);
  };
  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);
  useEffect(() => {
    onChange(fileList);
  }, [fileList]);
  return (
    <div
      className={cx('govuk-form-group', {
        'govuk-form-group--error': error,
      })}
    >
      <label className="govuk-label govuk-label--s" htmlFor={name}>
        {label}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="govuk-hint">
          {hint}
        </span>
      )}
      <label className="govuk-button govuk-button--secondary" htmlFor={name}>
        Choose file
      </label>
      <input
        className={cx('govuk-file-upload', {
          'govuk-input--error': error,
        })}
        id={name}
        name={name}
        type="file"
        onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])}
        aria-describedby={hint && `${name}-hint`}
        ref={inputRef}
        disabled={uploading}
        value={value}
        style={{ visibility: 'hidden' }}
        accept="image/*,.pdf"
      />
      {fileList && fileList.length > 0 && (
        <ul className="govuk-list govuk-body govuk-!-margin-bottom-9">
          {fileList.map((file) => (
            <li key={file}>
              {file.split('/').pop()}{' '}
              <span
                role="button"
                onClick={() => setFileList(fileList.filter((f) => f !== file))}
              >
                <DeleteIcon />
              </span>
            </li>
          ))}
        </ul>
      )}
      {uploading && (
        <div className="govuk-body govuk-!-margin-bottom-9">Uploading...</div>
      )}
      {error && <ErrorMessage text={error} />}
    </div>
  );
};

const ControlledFileUpload = ({ control, name, rules, ...otherProps }) => {
  const inputRef = useRef();
  return (
    <Controller
      as={<FileUpload inputRef={inputRef} {...otherProps} />}
      onChange={([value]) => value}
      name={name}
      rules={rules}
      onFocus={() => inputRef.current.focus()}
      control={control}
    ></Controller>
  );
};

export default ControlledFileUpload;
