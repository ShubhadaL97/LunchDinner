@auth @register
Feature: Sign Up via Modal
  As a new visitor
  I want to create an account via the Sign Up tab
  So that I can place orders

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Sign Up tab is visible in the login modal
    When I click the Login button
    Then the "Sign Up" tab should be visible in the modal

  @smoke
  Scenario: Sign Up tab opens the registration form
    When I click the Login button
    And I switch to the Sign Up tab
    Then the Sign Up form should be visible

  Scenario: Sign In tab is visible from Sign Up view
    When I click the Login button
    And I switch to the Sign Up tab
    Then the "Sign In" tab should be visible in the modal
