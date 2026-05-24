@complete-order-flow
Feature: Complete Order Flow - Login to Checkout
  As a customer
  I want to go through the complete order process
  So that I can successfully place an order with specific meals and verify all details

  Background:
    Given I am on the homepage

  @regression @smoke
  Scenario: Complete order journey from login to checkout with meal selections and cart management
    # Login Step
    When I click the Login button
    Then the login modal should be visible
    When I sign in with valid credentials
    Then I should be logged in successfully
    Then click on view weekly menu

    # Location Selection
    And the meal menu is loaded
    Then the pickup location dropdown should be available
    And at least one location should be available in the dropdown
    When I select a location from the pickup location dropdown
    Then the selected location should be displayed

    # Date Selection and Menu Availability
    When I select a pickup date from available dates
    Then meal cards should be visible on the homepage

    # Meal Type Selection
    When I click the "Dinner" meal tab
    Then the "Dinner" meal tab should be visible
    And meal cards should be visible on the homepage

    # Add Items to Cart
    When I add the first meal to cart
    And I add a different meal to cart
    And I add another different meal to cart
    Then the cart should have at least 3 items

    # Verify Cart Content
    When I scroll to the cart section
    Then the cart should have at least 1 item

    # Apply Invalid Promotion Code
    When I enter an invalid promotion code "12345" in the cart
    Then an error message should be displayed for invalid promotion code

    # Proceed to Checkout
    When I click the Checkout button
    Then the checkout flow should be visible
    And all order details should be visible in checkout
    And the order summary should show correct item count
    And the order summary should show correct total price
