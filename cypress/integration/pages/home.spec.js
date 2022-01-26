/// <reference types="cypress" />

context('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays correct information on the page', () => {
    cy.get('[data-testid=home-page-heading]')
      .last()
      .should('contain', 'Apply for the Omicron Additional Restrictions Grant');

    cy.get('[data-testid=home-page-heading]')
      .first()
      .should('contain', 'Apply for the Omicron Hospitality and Leisure Grant');
  });
});
