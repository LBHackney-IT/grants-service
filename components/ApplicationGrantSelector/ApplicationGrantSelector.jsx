import Link from 'next/link';
import { isExpired } from '../../utils/date';
import { stepKeys } from '../Steps';

const ApplicationGrantSelector = ({ date, expirationDate }) => {
  return (
    <>
      <OhlgGrantSelector date={date} expirationDate={expirationDate} />
      <ArgGrantSelector date={date} expirationDate={expirationDate} />
    </>
  );
};

const OhlgGrantSelector = ({ date, expirationDate }) => {
  return (
    <>
      <h1 data-testid="home-page-heading">
        Apply for the Omicron Hospitality and Leisure Grant
      </h1>
      <p className="govuk-body">
        The Omicron Hospitality and Leisure Grant is a one-off grant for
        businesses in the hospitality, leisure or accommodation sectors who pay
        business rates.
      </p>
      <p className="govuk-body">
        If you are a hospitality, leisure or accommodation sector business
        without a Hackney business rates account, please apply for the Omicron
        Additional Restrictions Grant instead.
      </p>
      <p className="govuk-body">
        If you are a gym or sports business where physical exercise or training
        takes place, either with or without a Hackney business rates account,
        please apply for the Omicron Additional Restrictions Grant instead.
      </p>
      {(!expirationDate ||
        !isExpired(new Date(expirationDate), new Date(date))) && (
        <Link
          href={`/grant/ohlg/step/${stepKeys[0]}`}
          className="govuk-button govuk-button--start govuk-!-margin-top-3"
          data-module="govuk-button"
        >
          <a
            href="#"
            className="govuk-button govuk-button--start govuk-!-margin-top-3"
          >
            Start now
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </a>
        </Link>
      )}
    </>
  );
};

const ArgGrantSelector = ({ date, expirationDate }) => {
  return (
    <>
      <h1 data-testid="home-page-heading">
        Apply for the Omicron Additional Restrictions Grant
      </h1>
      <p className="govuk-body">
        The Omicron Additional Restrictions Grant is a one-off grant for the
        following types of businesses:
      </p>
      <ul className="govuk-body">
        <li>
          Hospitality, leisure and accommodation businesses that are not Hackney
          business rate account holders and therefore not eligible for the
          Omicron Hospitality and Leisure Grant.
        </li>
        <li>
          Gyms and sports businesses where physical exercise or training takes
          place (either with or without a Hackney business rates account)
        </li>
        <li>
          Businesses which supply the hospitality, leisure or accommodation
          sectors (either with or without a Hackney business rates account).
        </li>
      </ul>
      <p className="govuk-body">
        If you are a hospitality, leisure or accommodation sector business who
        has a Hackney business rates account, please apply for the Omicron
        Hospitality and Leisure Grant instead.
      </p>
      {(!expirationDate ||
        !isExpired(new Date(expirationDate), new Date(date))) && (
        <Link
          href={`/grant/arg/step/${stepKeys[0]}`}
          className="govuk-button govuk-button--start govuk-!-margin-top-3"
          data-module="govuk-button"
        >
          <a
            href="#"
            className="govuk-button govuk-button--start govuk-!-margin-top-3"
          >
            Start now
            <svg
              className="govuk-button__start-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="17.5"
              height="19"
              viewBox="0 0 33 40"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
          </a>
        </Link>
      )}
    </>
  );
};

export default ApplicationGrantSelector;
