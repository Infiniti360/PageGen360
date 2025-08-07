export class CypressPage {
  constructor() {}

  login(email: string, password: string) {
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
  }

  waitForLoginSuccess() {
    cy.url().should('include', '/profiles');
  }

  navigateToHome() {
    cy.visit('/home');
  }

}
