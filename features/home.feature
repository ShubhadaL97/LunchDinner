@home
Feature: Homepage Content
  As a visitor
  I want to see the homepage content
  So that I can understand what the service offers

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Homepage loads with hero heading
    Then the hero heading should be visible

  @smoke
  Scenario: View Weekly Menu button is visible
    Then the "View Weekly Menu" button should be visible

  @smoke
  Scenario: Order section is visible on homepage
    Then the order section should be visible

  @smoke
  Scenario: Meal menu is displayed on homepage
    Then meal cards should be visible on the homepage

  Scenario: Cart section is visible on homepage
    Then the Cart section should be visible on the homepage

  Scenario: Cart is initially empty
    Then the cart should show empty message

  Scenario: About Our Kitchen section is visible
    Then the About Our Kitchen section should be visible

  Scenario: Date selector buttons are visible
    Then the date selector buttons should be visible
