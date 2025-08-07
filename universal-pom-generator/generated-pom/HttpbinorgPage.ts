export class CypressPage {
  constructor() {}

  getGithub-corner() {
    return cy.get("#github-corner");
  }

  clickGithub-corner() {
    cy.get("#github-corner").click();
  }

  waitGithub-corner(timeout: number = 5000) {
    cy.get("#github-corner").should('be.visible');
  }

  getTitle_httpbinorg() {
    return cy.get("#title_httpbinorg");
  }

  waitTitle_httpbinorg(timeout: number = 5000) {
    cy.get("#title_httpbinorg").should('be.visible');
  }

  getThedeveloperwebs() {
    return cy.get("#thedeveloperwebs");
  }

  waitThedeveloperwebs(timeout: number = 5000) {
    cy.get("#thedeveloperwebs").should('be.visible');
  }

  getThedeveloperwebs() {
    return cy.get("#thedeveloperwebs");
  }

  clickThedeveloperwebs() {
    cy.get("#thedeveloperwebs").click();
  }

  waitThedeveloperwebs(timeout: number = 5000) {
    cy.get("#thedeveloperwebs").should('be.visible');
  }

  getSendemailtothede() {
    return cy.get("#sendemailtothede");
  }

  clickSendemailtothede() {
    cy.get("#sendemailtothede").click();
  }

  waitSendemailtothede(timeout: number = 5000) {
    cy.get("#sendemailtothede").should('be.visible');
  }

  getSwagger-ui_poweredby() {
    return cy.get("#swagger-ui_poweredby");
  }

  waitSwagger-ui_poweredby(timeout: number = 5000) {
    cy.get("#swagger-ui_poweredby").should('be.visible');
  }

  getWrapper_poweredby() {
    return cy.get("#wrapper_poweredby");
  }

  waitWrapper_poweredby(timeout: number = 5000) {
    cy.get("#wrapper_poweredby").should('be.visible');
  }

  getPoweredby() {
    return cy.get("#poweredby");
  }

  waitPoweredby(timeout: number = 5000) {
    cy.get("#poweredby").should('be.visible');
  }

  getFlasgger() {
    return cy.get("#flasgger");
  }

  clickFlasgger() {
    cy.get("#flasgger").click();
  }

  waitFlasgger(timeout: number = 5000) {
    cy.get("#flasgger").should('be.visible');
  }

  getOtherutilities() {
    return cy.get("#otherutilities");
  }

  waitOtherutilities(timeout: number = 5000) {
    cy.get("#otherutilities").should('be.visible');
  }

  getHtmlform() {
    return cy.get("#htmlform");
  }

  clickHtmlform() {
    cy.get("#htmlform").click();
  }

  waitHtmlform(timeout: number = 5000) {
    cy.get("#htmlform").should('be.visible');
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
