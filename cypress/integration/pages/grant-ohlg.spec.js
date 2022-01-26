/// <reference types="cypress" />

context('Omicron Hospitality and Leisure Grant', () => {
  before(() => {
    cy.setHackneyCookie(true);
  });

  describe('Step 1 - Eligibility Criteria', () => {
    it('displays correct header', () => {
      cy.visit('/grant/ohlg/step/eligibility-criteria');

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Eligibility Criteria'
      );
    });

    it('can only be completed with valid values', () => {
      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Eligibility Criteria'
      );

      cy.get(
        '[name="eligibilityCriteria.tradingInHackney"][value="Yes"]'
      ).click();
      cy.get(
        '[name="eligibilityCriteria.liableForBusinessRates"][value="Yes"]'
      ).click();
      cy.get(
        '[name="eligibilityCriteria.businessSectorEligible"][value="Yes"]'
      ).click();
      cy.get(
        '[name="eligibilityCriteria.eligibleForOhlg"][value="Yes"]'
      ).click();
      cy.get(
        '[name="eligibilityCriteria.servedLegalNotices"][value="No"]'
      ).click();

      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Business Details'
      );
    });
  });

  describe('Step 2 - Business Details', () => {
    it('displays correct header', () => {
      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Business Details'
      );
    });

    it('can only be completed with valid values', () => {
      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Business Details'
      );

      cy.get('[id="business.businessName"]').type('Cookie Monster Cookies');
      cy.get('[id="business.businessStructure"]').select('Charity');
      cy.get('[id="business.businessIdentifyType"]').select(
        'National Insurance Number'
      );
      cy.get('[id="business.businessIdentifyNumber"]').type('EM132290C');
      cy.get('[id="business.highLevelSicCode"]').type('0111');

      cy.get('[id="business.businessTradingAddress.streetNumber"]').type('23');
      cy.get('[id="business.businessTradingAddress.street"]').type(
        'Sesame Street'
      );
      cy.get('[id="business.businessTradingAddress.town"]').type('Sesame Town');
      cy.get('[id="business.businessTradingAddress.postcode"]').type('SES 4ME');

      cy.get('[id="business.businessAddress.streetNumber"]').type('23');
      cy.get('[id="business.businessAddress.street"]').type('Sesame Street');
      cy.get('[id="business.businessAddress.town"]').type('Sesame Town');
      cy.get('[id="business.businessAddress.postcode"]').type('SES 4ME');

      cy.get('[id="business.businessSector"]').select('Hospitality');
      cy.get('[id="business.businessNature"]').type('Biscuits');
      cy.get('[name="business.isBusinessStillTrading"][value="Yes"]').click();

      cy.get('[id="business.dateEstablished-day"]').type('23');
      cy.get('[id="business.dateEstablished-month"]').type('12');
      cy.get('[id="business.dateEstablished-year"]').type('1989');

      cy.get('[id="business.businessSize"]').select('0-9 (Micro)');

      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should('contain', 'Your Details');
    });
  });

  describe('Step 3 - Your Details', () => {
    it('displays correct header', () => {
      cy.get('[data-testid=step-heading]').should('contain', 'Your Details');
    });

    it('can only be completed with valid values', () => {
      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should('contain', 'Your Details');

      cy.get('[id="contact.firstName"]').type('Cookie');
      cy.get('[id="contact.lastName"]').type('Monster');
      cy.get('[id="contact.emailAddress"]').type(
        'cookiemonster@sesamestreet.gov.uk'
      );
      cy.get('[id="contact.telephoneNumber"]').type('07922222222');

      cy.get('[id="contact.address.streetNumber"]').type('23');
      cy.get('[id="contact.address.street"]').type('Sesame Street');
      cy.get('[id="contact.address.town"]').type('Sesame Town');
      cy.get('[id="contact.address.postcode"]').type('SES 4ME');

      cy.get('[id="contact.dateOfBirth-day"]').type('23');
      cy.get('[id="contact.dateOfBirth-month"]').type('12');
      cy.get('[id="contact.dateOfBirth-year"]').type('1989');

      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should('contain', 'Bank Details');
    });
  });

  describe('Step 5 - Bank Details', () => {
    it('displays correct header', () => {
      cy.get('[data-testid=step-heading]').should('contain', 'Bank Details');
    });

    it('can only be completed with valid values', () => {
      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should('contain', 'Bank Details');

      cy.get('[id="businessBankAccount.bankName"]').type('Big Bank Inc');
      cy.get('[id="businessBankAccount.accountHolder"]').type('Cookie Monster');
      cy.get('[id="businessBankAccount.accountNumber"]').type('11922922');
      cy.get('[id="businessBankAccount.accountSortcode"]').type('444444');

      cy.get('button[type=submit]').click();

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Supplementary Information'
      );
    });
  });

  describe('Step 6 - Supplementary Information', () => {
    it('displays correct header', () => {
      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Supplementary Information'
      );
    });

    it('can only be completed with valid values', () => {
      cy.get('[id=content]')
        .find('[class=govuk-file-upload]')
        .should('have.length', 1);
      cy.get('button[type=submit]').click();
      cy.get('[class=govuk-error-message]')
        .first()
        .should('contain', 'Document required');
      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Supplementary Information'
      );
    });
  });
});
