@navigation
Feature: Navigation Header and Footer
  As a visitor
  I want to see the site header and footer
  So that I can navigate the website

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Header logo is visible
    Then the header logo should be visible

  @smoke
  Scenario: All header navigation buttons are visible
    Then the nav button "About" should be visible
    And the nav button "Work With Us" should be visible
    And the nav button "Gallery" should be visible
    And the nav button "Order Now" should be visible
    And the nav button "Login" should be visible

  @smoke
  Scenario: Footer is visible
    Then the footer should be visible

  Scenario: Footer contains Privacy Policy link
    Then the footer link "/privacy" should be visible

  Scenario: Footer contains Terms of Service link
    Then the footer link "/terms" should be visible

  Scenario: Privacy Policy page loads
    When I navigate to the Privacy Policy page
    Then the page should not be a 404

  Scenario: Terms of Service page loads
    When I navigate to the Terms of Service page
    Then the page should not be a 404

  Scenario: Clicking Order Now scrolls to the order section
    When I click the Order Now button
    Then the order section should be visible

  Scenario: Clicking About scrolls to the About section
    When I click the About button
    Then the About Our Kitchen section should be visible
