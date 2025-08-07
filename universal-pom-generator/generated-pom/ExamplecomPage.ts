export class CypressPage {
  constructor() {}

  getMoreinformation() {
    return cy.get("#moreinformation");
  }

  clickMoreinformation() {
    cy.get("#moreinformation").click();
  }

  waitMoreinformation(timeout: number = 5000) {
    cy.get("#moreinformation").should('be.visible');
  }

  waitForPageLoad() {
    cy.wait(1000);
  }

  getPageTitle() {
    return cy.title();
  }

  takeScreenshot(filename: string) {
    cy.screenshot(filename || 'screenshot');
  }

}
