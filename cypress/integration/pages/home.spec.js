/// <reference types="cypress" />

context('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays correct information on the page', () => {
    cy.get('[data-testid=home-page-heading]')
      .last()
      .should(
        'contain',
        'Apply for the COVID-19 Additional Restrictions Grant'
      );

    cy.get('[data-testid=home-page-heading]')
      .first()
      .should('contain', 'Apply for the Omicron Hospitality and Leisure Grant');

    cy.get('[data-testid=arg-govuk-link]')
      .should('have.attr', 'href')
      .and(
        'eq',
        'https://www.gov.uk/guidance/check-if-youre-eligible-for-the-coronavirus-additional-restrictions-grant'
      );

    cy.get('[data-testid=arg-hackney-link]')
      .should('have.attr', 'href')
      .and('eq', 'https://hackney.gov.uk/business-grants');
  });
});
