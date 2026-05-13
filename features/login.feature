@auth @login
Feature: Login Modal
  As a registered user
  I want to sign in via the login modal
  So that I can access my account and place orders

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Login modal opens when Login button is clicked
    When I click the Login button
    Then the login modal should be visible

  @smoke
  Scenario: Login modal contains Sign In and Sign Up tabs
    When I click the Login button
    Then the "Sign In" tab should be visible in the modal
    And the "Sign Up" tab should be visible in the modal

  @smoke
  Scenario: Sign In form has email and password fields
    When I click the Login button
    Then the email input should be visible in the modal
    And the password input should be visible in the modal
    And the Sign In button should be visible in the modal

  Scenario: Forgot Password link is visible
    When I click the Login button
    Then the Forgot password link should be visible in the modal

  Scenario: Continue with Google button is visible
    When I click the Login button
    Then the Continue with Google button should be visible in the modal

  @smoke
  Scenario: Successful login with valid credentials
    When I click the Login button
    And I sign in with valid credentials
    Then I should be logged in successfully

  Scenario: Error shown for invalid credentials
    When I click the Login button
    And I sign in with email "invalid@gmail.com" and password "WrongPassword99"
    Then a sign in error should be visible
