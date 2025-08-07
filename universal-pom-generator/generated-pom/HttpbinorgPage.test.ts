// Cypress Test File

describe('HttpbinorgPage Tests', () => {
  const pom = new HttpbinorgPage();

  beforeEach(() => {
    cy.visit('https://httpbin.org/');
  });

  it('should load page successfully', () => {
    cy.title().should('exist');
  });

  it('should have interactive elements', () => {
    // Test that elements are accessible
    cy.get('body').should('be.visible');
  });
});
