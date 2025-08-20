// Cypress Test File
import { StagingmytocafootballcomHomePage } from './StagingmytocafootballcomHomePage';

describe('StagingmytocafootballcomHomePage Tests', () => {
  const pom = new StagingmytocafootballcomHomePage();

  beforeEach(() => {
    cy.visit('https://staging.my.tocafootball.com/home');
  });

  it('should load page successfully', () => {
    cy.title().should('exist');
  });

  it('should have interactive elements', () => {
    cy.get('body').should('be.visible');
  });

  it('getLeaderboard should exist', () => {
    pom.getLeaderboard().should('exist');
  });
  it('waitLeaderboard should resolve', () => {
    pom.waitLeaderboard(8000);
  });
  it('getPlayerHomeContainer should exist', () => {
    pom.getPlayerHomeContainer().should('exist');
  });
  it('waitPlayerHomeContainer should resolve', () => {
    pom.waitPlayerHomeContainer(8000);
  });
  it('getPlayerCardContainer should exist', () => {
    pom.getPlayerCardContainer().should('exist');
  });
  it('waitPlayerCardContainer should resolve', () => {
    pom.waitPlayerCardContainer(8000);
  });
  it('getLeaderboard2 should exist', () => {
    pom.getLeaderboard2().should('exist');
  });
  it('waitLeaderboard2 should resolve', () => {
    pom.waitLeaderboard2(8000);
  });
  it('getLeaderboard3 should exist', () => {
    pom.getLeaderboard3().should('exist');
  });
  it('waitLeaderboard3 should resolve', () => {
    pom.waitLeaderboard3(8000);
  });
  it('getLeaderboard4 should exist', () => {
    pom.getLeaderboard4().should('exist');
  });
  it('waitLeaderboard4 should resolve', () => {
    pom.waitLeaderboard4(8000);
  });
  it('getLeaderboard5 should exist', () => {
    pom.getLeaderboard5().should('exist');
  });
  it('waitLeaderboard5 should resolve', () => {
    pom.waitLeaderboard5(8000);
  });
  it('getLeaderboard6 should exist', () => {
    pom.getLeaderboard6().should('exist');
  });
  it('waitLeaderboard6 should resolve', () => {
    pom.waitLeaderboard6(8000);
  });
  it('getLeaderboard7 should exist', () => {
    pom.getLeaderboard7().should('exist');
  });
  it('waitLeaderboard7 should resolve', () => {
    pom.waitLeaderboard7(8000);
  });
  it('getJerseyBackName should exist', () => {
    pom.getJerseyBackName().should('exist');
  });
  it('waitJerseyBackName should resolve', () => {
    pom.waitJerseyBackName(8000);
  });
  it('getJerseyBackNumber should exist', () => {
    pom.getJerseyBackNumber().should('exist');
  });
  it('waitJerseyBackNumber should resolve', () => {
    pom.waitJerseyBackNumber(8000);
  });
  it('getLeaderboard8 should exist', () => {
    pom.getLeaderboard8().should('exist');
  });
  it('waitLeaderboard8 should resolve', () => {
    pom.waitLeaderboard8(8000);
  });
  it('getLeaderboard9 should exist', () => {
    pom.getLeaderboard9().should('exist');
  });
  it('waitLeaderboard9 should resolve', () => {
    pom.waitLeaderboard9(8000);
  });
  it('getPlayerCardFirstName should exist', () => {
    pom.getPlayerCardFirstName().should('exist');
  });
  it('waitPlayerCardFirstName should resolve', () => {
    pom.waitPlayerCardFirstName(8000);
  });
  it('getPlayerCardLastName should exist', () => {
    pom.getPlayerCardLastName().should('exist');
  });
  it('waitPlayerCardLastName should resolve', () => {
    pom.waitPlayerCardLastName(8000);
  });
});
