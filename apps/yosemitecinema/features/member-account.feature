@regression @member
Feature: Member-authenticated flows

    Background:
        Given I am on the now playing page
        When I select a movie that has scheduled showtimes
        And I pick the first available showtime
        And I log in as a member
        Then I should be logged in as a member

    Scenario: Account dashboard shows greeting, sections and logout
        Given I am on the account dashboard page
        Then the account dashboard should show a greeting and all main sections

    @smoke
    Scenario: Member checkout shows personalised greeting
        Then the member greeting should be visible on the tickets tab
        And the continue as guest option should not be shown

    Scenario: Logging out clears the session and returns to the login form
        Given I am on the account dashboard page
        When I log out from the account page
        Then I should be logged out with the login form visible at checkout
