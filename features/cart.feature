@cart
Feature: Shopping Cart
  As a user
  I want to manage items in my cart
  So that I can review my order before checkout

  Background:
    Given I am on the homepage

  @smoke
  Scenario: Cart section is visible on the homepage
    Then the Cart section should be visible on the homepage

  @smoke
  Scenario: Cart is empty before adding any items
    Then the cart should show empty message

  @smoke
  Scenario: Adding a meal shows it in the cart
    Given the meal menu is loaded
    When I add the first meal to cart
    Then the cart should not be empty

  Scenario: Checkout button appears when cart has items
    Given the meal menu is loaded
    When I add the first meal to cart
    And I scroll to the cart section
    Then the Checkout button should be visible in the cart
