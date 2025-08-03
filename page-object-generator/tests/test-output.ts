// mytoca_member_portal.ts
// Generated POM for: MyTOCA - Member Portal
// URL: https://staging.my.tocafootball.com/avatar-creator
// Total elements found: 45
// Interactive elements found: 12

export class MytocaMemberPortalPage {
  visit() {
    cy.visit('https://staging.my.tocafootball.com/avatar-creator');
  }

  // Enhanced method names using data-test-id values
  clickAvatarCreator() {
    cy.get('[data-test-id="avatar-creator"]').click();
  }

  clickAvatarPreview() {
    cy.get('[data-test-id="avatar-preview"]').click();
  }

  clickAvatarPreviewImageContainer() {
    cy.get('[data-test-id="avatar-preview-image-container"]').click();
  }

  clickAvatarPreviewImage() {
    cy.get('[data-test-id="avatar-preview-image"]').click();
  }

  clickAvatarPreviewEditButton() {
    cy.get('[data-test-id="avatar-preview-edit-button"]').click();
  }

  clickAvatarCreatorBody() {
    cy.get('[data-test-id="avatar-creator-body"]').click();
  }

  clickAvatarCreatorBackButton() {
    cy.get('[data-test-id="avatar-creator-back-button"]').click();
  }

  clickAvatarCreatorNextButton() {
    cy.get('[data-test-id="avatar-creator-next-button"]').click();
  }

  clickAvatarCreatorPhotoSourceSelector() {
    cy.get('[data-test-id="avatar-creator-photo-source-selector"]').click();
  }

  clickAvatarCreatorPhotoSourceSelectorTakePhotoButton() {
    cy.get('[data-test-id="avatar-creator-photo-source-selector-take-photo-button"]').click();
  }

  clickAvatarCreatorPhotoSourceSelectorUploadPhotoButton() {
    cy.get('[data-test-id="avatar-creator-photo-source-selector-upload-photo-button"]').click();
  }

  // File input for photo upload
  enterFileInput(value: string) {
    cy.get('input[type="file"]').attachFile(value);
  }
} 