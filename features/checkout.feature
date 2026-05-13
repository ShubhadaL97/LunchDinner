@checkout
Feature: Checkout Flow
  As a user with items in my cart
  I want to proceed to checkout
  So that I can place my order

  Background:
    Given I am on the homepage
    And I am logged in as a valid user
    And the meal menu is loaded

  @smoke
  Scenario: Checkout button appears in cart after adding an item
    When I add the first meal to cart
    And I scroll to the cart section
    Then the Checkout button should be visible in the cart

  Scenario: Clicking checkout starts the checkout flow
    When I add the first meal to cart
    And I scroll to the cart section
    And I click the Checkout button
    Then the checkout flow should be visible
