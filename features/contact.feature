@contact
Feature: Contact Information and Legal Pages
  As a user
  I want to access contact details and legal pages
  So that I can get help and understand policies

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Contact information is in the footer
    Then the phone link should be visible in the footer
    And the email link should be visible in the footer

  @smoke
  Scenario: Privacy Policy page loads without 404
    When I navigate to the Privacy Policy page
    Then the page should not be a 404

  @smoke
  Scenario: Terms of Service page loads without 404
    When I navigate to the Terms of Service page
    Then the page should not be a 404

  Scenario: Privacy Policy link is visible in footer
    Then the footer link "/privacy" should be visible

  Scenario: Terms of Service link is visible in footer
    Then the footer link "/terms" should be visible
