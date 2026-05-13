@menu
Feature: Meal Menu and Ordering
  As a user
  I want to browse and select meals
  So that I can add them to my cart

  Background:
    Given I am on the homepage
    And the meal menu is loaded

  @smoke
  Scenario: Meal cards are displayed with names and prices
    Then meal cards should be visible on the homepage
    And meal prices should be displayed

  @smoke
  Scenario: Lunch and Dinner tabs are visible
    Then the "Lunch" meal tab should be visible
    And the "Dinner" meal tab should be visible

  Scenario: Clicking Lunch tab shows Lunch meals
    When I click the "Lunch" meal tab
    Then meal cards should be visible on the homepage

  Scenario: Clicking Dinner tab shows Dinner meals
    When I click the "Dinner" meal tab
    Then meal cards should be visible on the homepage

  @smoke
  Scenario: Date selector buttons are visible and selectable
    Then the date selector buttons should be visible
    When I click the first available date
    Then meal cards should be visible on the homepage

  Scenario: Add to Cart button is visible on meal cards
    Then the Add to Cart button should be visible

  @smoke
  Scenario: Adding a meal updates the cart
    When I add the first meal to cart
    Then the cart should not be empty
