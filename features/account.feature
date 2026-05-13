@auth @account
Feature: User Account
  As a logged-in user
  I want to manage my account
  So that I can maintain my profile

  Background:
    Given I am on the homepage
    And I am logged in as a valid user

  @smoke
  Scenario: Login button is no longer shown after login
    Then the Login button should not be visible

  Scenario: User can log out
    When I log out
    Then the Login button should be visible again
