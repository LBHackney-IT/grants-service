/// <reference types="cypress" />

context('Grant page', () => {
  before(() => {
    cy.setHackneyCookie(true);
  });

  describe('page content', () => {
    it('displays correct name in the heading', () => {
      cy.visit('/grant/arg-3/step/1');

      cy.get('[data-testid=page-heading]').should(
        'contain',
        'Additional Restrictions Grant – Round 3'
      );
    });
  });
});
