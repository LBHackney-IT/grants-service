/// <reference types="cypress" />

context('Grant page', () => {
  before(() => {
    cy.setHackneyCookie(true);
  });

  describe('page content', () => {
    it('displays first step header', () => {
      cy.visit('/grant/ohlg/step/eligibility-criteria');

      cy.get('[data-testid=step-heading]').should(
        'contain',
        'Eligibility Criteria'
      );
    });
  });
});
