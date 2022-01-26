import PropTypes from 'prop-types';

const BasicSelect = ({ value, onChange = console.log, label, options }) => (
  <div className="govuk-form-group">
    <label className="govuk-label" htmlFor={label}>
      {label}
    </label>
    <select
      className="govuk-select"
      id={label}
      value={value}
      onChange={(e) => {
        onChange(e.target.value || undefined);
      }}
      data-testid="basic-select"
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

BasicSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default BasicSelect;
