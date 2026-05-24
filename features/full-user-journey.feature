@smoke @journey @optimized
Feature: Complete User Journey - Single Login Session
  As a user
  I want to perform a complete order journey
  Without logging in multiple times

  Background:
    Given I am on the homepage
    And I am logged in as a valid user
    Then the Login button should not be visible
    And I should see the username displayed in the navigation

  @smoke @scenario1
  Scenario: 1. Verify Homepage After Login
    When I navigate to the homepage
    Then the page title should contain "Lunch"
    And I should see navigation menu items

  @smoke @scenario2
  Scenario: 2. View Meal Menu
    When I navigate to the menu page
    And the meal menu is loaded
    Then meal cards should be visible on the homepage
    And the "Lunch" meal tab should be visible
    And the "Dinner" meal tab should be visible

  @smoke @scenario3
  Scenario: 3. Select Lunch Meals
    When I navigate to the menu page
    And the meal menu is loaded
    When I click the "Lunch" meal tab
    Then meal cards should be visible on the homepage

  @smoke @scenario4
  Scenario: 4. Select Dinner Meals
    When I navigate to the menu page
    And the meal menu is loaded
    When I click the "Dinner" meal tab
    Then meal cards should be visible on the homepage

  @smoke @scenario5
  Scenario: 5. Add First Meal To Cart
    When I navigate to the menu page
    And the meal menu is loaded
    When I add the first meal to cart
    Then the Add to Cart button should be visible

  @scenario6
  Scenario: 6. View Cart
    When I navigate to cart
    Then the page should load successfully

  @scenario7
  Scenario: 7. Verify User Still Logged In
    When I navigate to the homepage
    Then the Login button should not be visible
    And I should see the username displayed in the navigation

  @scenario8
  Scenario: 8. View Account
    When I navigate to account page
    Then the page should load successfully

  @scenario9
  Scenario: 9. Navigate Between Pages
    When I click on "About" link
    Then the page should load successfully
    When I navigate to the homepage
    Then the page title should contain "Lunch"

  @scenario10
  Scenario: 10. Final Login Status Check
    When I navigate to the homepage
    Then the Login button should not be visible
    And I should see the username displayed in the navigation
