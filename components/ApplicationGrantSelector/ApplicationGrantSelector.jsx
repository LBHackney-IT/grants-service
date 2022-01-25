import Router from 'next/router';
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
      <p className="govuk-body">Some text here</p>
      {(!expirationDate ||
        !isExpired(new Date(expirationDate), new Date(date))) && (
        <button
          href="#"
          role="button-ohlg"
          draggable="false"
          className="govuk-button govuk-button--start govuk-!-margin-top-3"
          data-module="govuk-button"
          onClick={() => Router.push(`/grant/ohlg/step/${stepKeys[0]}`)}
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
        </button>
      )}
    </>
  );
};

const ArgGrantSelector = ({ date, expirationDate }) => {
  return (
    <>
      <h1 data-testid="home-page-heading">
        Apply for the COVID-19 Additional Restrictions Grant - Round 2
      </h1>
      <p className="govuk-body">
        The Government has announced a series of grants for certain businesses
        affected by the COVID-19 pandemic.
      </p>
      <p className="govuk-body">
        By completing this application form, you will be considered for the
        COVID-19{' '}
        <a
          className="govuk-link"
          href="https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant"
          data-testid="arg-govuk-link"
        >
          Additional Restrictions Grant
        </a>
        .
      </p>
      <p className="govuk-body">
        Check{' '}
        <a
          className="govuk-link"
          href="https://hackney.gov.uk/business-grants"
          data-testid="arg-hackney-link"
        >
          additional restrictions grant
        </a>{' '}
        for more information by Hackney Council.
      </p>
      {(!expirationDate ||
        !isExpired(new Date(expirationDate), new Date(date))) && (
        <button
          href="#"
          role="button"
          draggable="false"
          className="govuk-button govuk-button--start govuk-!-margin-top-3"
          data-module="govuk-button"
          onClick={() => Router.push(`/grant/arg-3/step/${stepKeys[0]}`)}
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
        </button>
      )}
    </>
  );
};

export default ApplicationGrantSelector;
