// Cypress Test File

describe('ExamplecomPage Tests', () => {
  const pom = new ExamplecomPage();

  beforeEach(() => {
    cy.visit('https://example.com');
  });

  it('should load page successfully', () => {
    cy.title().should('exist');
  });

  it('should have interactive elements', () => {
    // Test that elements are accessible
    cy.get('body').should('be.visible');
  });
});
