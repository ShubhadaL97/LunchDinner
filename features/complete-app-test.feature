@complete @single-session
Feature: Complete App Test - Single Login Session
  As a user
  I want to test the entire application
  By logging in once and performing all scenarios

  Background:
    Given I am on the homepage
    And I am logged in as a valid user

  # ============ AUTHENTICATION TESTS ============
  @auth @test-1
  Scenario: 1. Login was successful
    Then the Login button should not be visible
    And I should see the username displayed in the navigation

  @auth @test-2
  Scenario: 2. User remains logged in
    When I navigate to the homepage
    Then the Login button should not be visible

  # ============ HOMEPAGE TESTS ============
  @homepage @test-3
  Scenario: 3. Homepage loads correctly
    When I navigate to the homepage
    Then the page title should contain "Lunch"
    And I should see navigation menu items
    And the page should load successfully

  @homepage @test-4
  Scenario: 4. Hero section displays
    When I navigate to the homepage
    Then the order section should be visible

  @homepage @test-5
  Scenario: 5. About section visible
    When I navigate to the homepage
    Then the About Our Kitchen section should be visible

  # ============ NAVIGATION TESTS ============
  @navigation @test-6
  Scenario: 6. Navigation menu visible
    When I navigate to the homepage
    Then the header logo should be visible
    And I should see navigation menu items

  @navigation @test-7
  Scenario: 7. Navigation links work
    When I navigate to the homepage
    And I click on "About" link
    Then the page should load successfully
    When I navigate to the homepage
    Then the page title should contain "Lunch"

  # ============ MENU TESTS ============
  @menu @test-8
  Scenario: 8. Menu page loads
    When I navigate to the menu page
    And the meal menu is loaded
    Then the page should load successfully

  @menu @test-9
  Scenario: 9. Meal cards visible
    When I navigate to the menu page
    And the meal menu is loaded
    Then meal cards should be visible on the homepage

  @menu @test-10
  Scenario: 10. Lunch tab available
    When I navigate to the menu page
    And the meal menu is loaded
    Then the "Lunch" meal tab should be visible

  @menu @test-11
  Scenario: 11. Dinner tab available
    When I navigate to the menu page
    And the meal menu is loaded
    Then the "Dinner" meal tab should be visible

  @menu @test-12
  Scenario: 12. Can select lunch meals
    When I navigate to the menu page
    And the meal menu is loaded
    When I click the "Lunch" meal tab
    Then meal cards should be visible on the homepage

  @menu @test-13
  Scenario: 13. Can select dinner meals
    When I navigate to the menu page
    And the meal menu is loaded
    When I click the "Dinner" meal tab
    Then meal cards should be visible on the homepage

  @menu @test-14
  Scenario: 14. Add to cart button visible
    When I navigate to the menu page
    And the meal menu is loaded
    Then the Add to Cart button should be visible

  # ============ CART TESTS ============
  @cart @test-15
  Scenario: 15. Cart page accessible
    When I navigate to cart
    Then the page should load successfully

  # ============ ACCOUNT TESTS ============
  @account @test-16
  Scenario: 16. Account page accessible
    When I navigate to account page
    Then the page should load successfully

  # ============ SESSION PERSISTENCE TESTS ============
  @session @test-17
  Scenario: 17. Session persists after menu navigation
    When I navigate to the menu page
    And the meal menu is loaded
    When I navigate to the homepage
    Then the Login button should not be visible

  @session @test-18
  Scenario: 18. Session persists after cart visit
    When I navigate to cart
    When I navigate to the homepage
    Then the Login button should not be visible

  @session @test-19
  Scenario: 19. Session persists after account visit
    When I navigate to account page
    When I navigate to the homepage
    Then the Login button should not be visible

  @session @test-20
  Scenario: 20. Still logged in - final check
    When I navigate to the homepage
    Then the Login button should not be visible
    And I should see the username displayed in the navigation
    And the page title should contain "Lunch"
