@regression @ui
Feature: SauceDemo checkout

    Scenario: Complete a purchase end to end
        Given I am logged in as a standard user
        Then I should see the products page
        When I add the "sauce-labs-backpack" to the cart
        Then the cart badge should show 1
        When I open the cart
        Then the cart should contain 1 item
        When I proceed to checkout
        And I enter my checkout information
        And I finish the checkout
        Then I should see the order confirmation
