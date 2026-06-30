@regression @cart
Feature: Cart validation

    Background:
        Given I am on the now playing page
        When I select a movie that has scheduled showtimes
        And I pick the first available showtime
        And I continue as guest

    @smoke
    Scenario: Cart grand total equals the sum of line totals
        When I add the first ticket type to my cart
        Then the cart summary should show 1 ticket
        When I advance to Food & Drink
        And I advance to Cart
        Then I should be on the cart page
        And the grand total should equal the sum of the line totals

    Scenario: Cart summary reactively updates when a ticket is added
        When I add the first ticket type to my cart
        Then the cart summary should show 1 ticket
        When I add the first ticket type to my cart
        Then the cart summary should show 2 tickets

    Scenario: Reloading the cart page clears it and redirects home
        When I add the first ticket type to my cart
        And I advance to Food & Drink
        And I advance to Cart
        Then I should be on the cart page
        When I reload the cart page
        Then I should be redirected to the home page
        And the cart should be empty
