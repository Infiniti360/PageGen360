/// <reference types="cypress" />


export class StagingmytocafootballcomHomePage {

  visit() {
    cy.visit('https://staging.my.tocafootball.com/home');
  }

  getLeaderboard() {
    return cy.get('#root .ml-4.flex.items-center.justify-center.text-base.text-white');
  }

  waitLeaderboard(timeout = 5000) {
    cy.get('#root .ml-4.flex.items-center.justify-center.text-base.text-white').should('be.visible');
  }

  getPlayerHomeContainer() {
    return cy.get('[data-test-id="player-home-container"]');
  }

  waitPlayerHomeContainer(timeout = 5000) {
    cy.get('[data-test-id="player-home-container"]').should('be.visible');
  }

  getPlayerCardContainer() {
    return cy.get('[data-test-id="player-card-container"]');
  }

  waitPlayerCardContainer(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"]').should('be.visible');
  }

  getLeaderboard2() {
    return cy.get('[data-test-id="player-card-container"] .relative.h-full.w-full.rounded-lg.overflow-hidden');
  }

  waitLeaderboard2(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .relative.h-full.w-full.rounded-lg.overflow-hidden').should('be.visible');
  }

  getLeaderboard3() {
    return cy.get('[data-test-id="player-card-container"] .h-full.p-1');
  }

  waitLeaderboard3(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .h-full.p-1').should('be.visible');
  }

  getLeaderboard4() {
    return cy.get('[data-test-id="player-card-container"] .relative.flex.h-full.w-full.flex-col.items-center.justify-between.rounded-lg.p-2');
  }

  waitLeaderboard4(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .relative.flex.h-full.w-full.flex-col.items-center.justify-between.rounded-lg.p-2').should('be.visible');
  }

  getLeaderboard5() {
    return cy.get('[data-test-id="player-card-container"] .flex.w-full.justify-between');
  }

  waitLeaderboard5(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .flex.w-full.justify-between').should('be.visible');
  }

  getLeaderboard6() {
    return cy.get('[data-test-id="player-card-container"] .flex.h-[72px].w-[72px].cursor-pointer.items-center.justify-center.rounded-full.bg-white');
  }

  waitLeaderboard6(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .flex.h-[72px].w-[72px].cursor-pointer.items-center.justify-center.rounded-full.bg-white').should('be.visible');
  }

  getLeaderboard7() {
    return cy.get('[data-test-id="player-card-container"] .relative.flex.max-w-fit.justify-center');
  }

  waitLeaderboard7(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .relative.flex.max-w-fit.justify-center').should('be.visible');
  }

  getJerseyBackName() {
    return cy.get('[data-test-id="jersey-back-name"]');
  }

  waitJerseyBackName(timeout = 5000) {
    cy.get('[data-test-id="jersey-back-name"]').should('be.visible');
  }

  getJerseyBackNumber() {
    return cy.get('[data-test-id="jersey-back-number"]');
  }

  waitJerseyBackNumber(timeout = 5000) {
    cy.get('[data-test-id="jersey-back-number"]').should('be.visible');
  }

  getLeaderboard8() {
    return cy.get('[data-test-id="player-card-container"] .mt-9.flex.w-full.flex-col.items-center');
  }

  waitLeaderboard8(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .mt-9.flex.w-full.flex-col.items-center').should('be.visible');
  }

  getLeaderboard9() {
    return cy.get('[data-test-id="player-card-container"] .mt-10.flex.flex-col.items-center');
  }

  waitLeaderboard9(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .mt-10.flex.flex-col.items-center').should('be.visible');
  }

  getPlayerCardFirstName() {
    return cy.get('[data-test-id="player-card-first-name"]');
  }

  waitPlayerCardFirstName(timeout = 5000) {
    cy.get('[data-test-id="player-card-first-name"]').should('be.visible');
  }

  getPlayerCardLastName() {
    return cy.get('[data-test-id="player-card-last-name"]');
  }

  waitPlayerCardLastName(timeout = 5000) {
    cy.get('[data-test-id="player-card-last-name"]').should('be.visible');
  }

  getLeaderboard10() {
    return cy.get('[data-test-id="player-card-container"] .flex.w-full.justify-between.text-center');
  }

  waitLeaderboard10(timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .flex.w-full.justify-between.text-center').should('be.visible');
  }

  getAllLeaderboard11() {
    return cy.get('[data-test-id="player-card-container"] .text-base.opacity-70');
  }

  getLeaderboard11At(index) {
    return cy.get('[data-test-id="player-card-container"] .text-base.opacity-70').eq(index);
  }

  waitLeaderboard11At(index, timeout = 5000) {
    cy.get('[data-test-id="player-card-container"] .text-base.opacity-70').eq(index).should('be.visible');
  }

  getPlayerCardAgeValue() {
    return cy.get('[data-test-id="player-card-age-value"]');
  }

  waitPlayerCardAgeValue(timeout = 5000) {
    cy.get('[data-test-id="player-card-age-value"]').should('be.visible');
  }

  getPlayerCardRepsValue() {
    return cy.get('[data-test-id="player-card-reps-value"]');
  }

  waitPlayerCardRepsValue(timeout = 5000) {
    cy.get('[data-test-id="player-card-reps-value"]').should('be.visible');
  }

  getLeaderboard12() {
    return cy.get('[data-test-id="player-home-container"] .w-full');
  }

  waitLeaderboard12(timeout = 5000) {
    cy.get('[data-test-id="player-home-container"] .w-full').should('be.visible');
  }

  getAllLeaderboardLink() {
    return cy.get('[data-test-id="player-home-container"] .block.text-xl');
  }

  getLeaderboardLinkAt(index) {
    return cy.get('[data-test-id="player-home-container"] .block.text-xl').eq(index);
  }

  waitLeaderboardLinkAt(index, timeout = 5000) {
    cy.get('[data-test-id="player-home-container"] .block.text-xl').eq(index).should('be.visible');
  }

  clickLeaderboardLinkAt(index) {
    cy.get('[data-test-id="player-home-container"] .block.text-xl').eq(index).click();
  }

  getAllLeaderboard13() {
    return cy.get('[data-test-id="player-home-container"] .mb-4.flex.items-center');
  }

  getLeaderboard13At(index) {
    return cy.get('[data-test-id="player-home-container"] .mb-4.flex.items-center').eq(index);
  }

  waitLeaderboard13At(index, timeout = 5000) {
    cy.get('[data-test-id="player-home-container"] .mb-4.flex.items-center').eq(index).should('be.visible');
  }

  getAllLeaderboard14() {
    return cy.get('[data-test-id="player-home-container"] .text-xl.font-semibold');
  }

  getLeaderboard14At(index) {
    return cy.get('[data-test-id="player-home-container"] .text-xl.font-semibold').eq(index);
  }

  waitLeaderboard14At(index, timeout = 5000) {
    cy.get('[data-test-id="player-home-container"] .text-xl.font-semibold').eq(index).should('be.visible');
  }

  getAllLeaderboard15() {
    return cy.get('[data-test-id="player-home-container"] .mt-4.min-h-20.rounded-lg.bg-mls-grey.p-6.text-center.text-base');
  }

  getLeaderboard15At(index) {
    return cy.get('[data-test-id="player-home-container"] .mt-4.min-h-20.rounded-lg.bg-mls-grey.p-6.text-center.text-base').eq(index);
  }

  waitLeaderboard15At(index, timeout = 5000) {
    cy.get('[data-test-id="player-home-container"] .mt-4.min-h-20.rounded-lg.bg-mls-grey.p-6.text-center.text-base').eq(index).should('be.visible');
  }

  getUpcomingSessionContainer() {
    return cy.get('[data-test-id="upcoming-session-container"]');
  }

  waitUpcomingSessionContainer(timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-container"]').should('be.visible');
  }

  getUpcoming() {
    return cy.get('[data-test-id="upcoming-session-container"] .pb-6.text-lg.font-medium');
  }

  waitUpcoming(timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-container"] .pb-6.text-lg.font-medium').should('be.visible');
  }

  getAllUpcomingSessionBlank() {
    return cy.get('[data-test-id="upcoming-session-blank"]');
  }

  getUpcomingSessionBlankAt(index) {
    return cy.get('[data-test-id="upcoming-session-blank"]').eq(index);
  }

  waitUpcomingSessionBlankAt(index, timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-blank"]').eq(index).should('be.visible');
  }

  getAllOhNoNoSessionBooked() {
    return cy.get('[data-test-id="upcoming-session-blank"] .flex.h-16.w-16.flex-shrink-0.items-center.justify-center.rounded-full.bg-mls-primary.text-white');
  }

  getOhNoNoSessionBookedAt(index) {
    return cy.get('[data-test-id="upcoming-session-blank"] .flex.h-16.w-16.flex-shrink-0.items-center.justify-center.rounded-full.bg-mls-primary.text-white').eq(index);
  }

  waitOhNoNoSessionBookedAt(index, timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-blank"] .flex.h-16.w-16.flex-shrink-0.items-center.justify-center.rounded-full.bg-mls-primary.text-white').eq(index).should('be.visible');
  }

  getAllSessionTime() {
    return cy.get('[data-test-id="session-time"]');
  }

  getSessionTimeAt(index) {
    return cy.get('[data-test-id="session-time"]').eq(index);
  }

  waitSessionTimeAt(index, timeout = 5000) {
    cy.get('[data-test-id="session-time"]').eq(index).should('be.visible');
  }

  getAllOhNoNoSessionBooked2() {
    return cy.get('[data-test-id="upcoming-session-blank"] .space-y-1');
  }

  getOhNoNoSessionBooked2At(index) {
    return cy.get('[data-test-id="upcoming-session-blank"] .space-y-1').eq(index);
  }

  waitOhNoNoSessionBooked2At(index, timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-blank"] .space-y-1').eq(index).should('be.visible');
  }

  getAllOhNoNoSessionBooked3() {
    return cy.get('[data-test-id="upcoming-session-blank"] .text-base.font-medium');
  }

  getOhNoNoSessionBooked3At(index) {
    return cy.get('[data-test-id="upcoming-session-blank"] .text-base.font-medium').eq(index);
  }

  waitOhNoNoSessionBooked3At(index, timeout = 5000) {
    cy.get('[data-test-id="upcoming-session-blank"] .text-base.font-medium').eq(index).should('be.visible');
  }

  getAllSessionType() {
    return cy.get('[data-test-id="session-type"]');
  }

  getSessionTypeAt(index) {
    return cy.get('[data-test-id="session-type"]').eq(index);
  }

  waitSessionTypeAt(index, timeout = 5000) {
    cy.get('[data-test-id="session-type"]').eq(index).should('be.visible');
  }


}