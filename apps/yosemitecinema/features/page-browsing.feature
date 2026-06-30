@regression @browse
Feature: Informational pages and navigation

    @smoke
    Scenario: Now playing page loads
        When I am on the now playing page
        Then the now playing page should be loaded

    Scenario: Now playing page shows movies or the empty state
        When I am on the now playing page
        Then the now playing page should be loaded
        And movies should be listed or the page should show no movies

    Scenario: Coming soon page loads and displays its content
        When I am on the coming soon page
        Then the coming soon page should be loaded
        And the coming soon page should display its content

    Scenario: Calendar page shows showtime content
        When I am on the calendar page
        Then the calendar page should be loaded
        And the calendar should show showtime content

    Scenario: Membership page shows tiers and pricing
        When I am on the membership page
        Then the membership tiers should be visible
        And the membership prices should be displayed
        And the day pass option should be visible

    Scenario: VR page shows flagship experience and technology
        When I am on the VR experience page
        Then the VR page should show the flagship experience
        And the VR page should credit Bryan Cranston and mention Positron technology

    Scenario: Our story page shows team members and media mentions
        When I am on the our story page
        Then the our story page should show team members
        And the our story page should mention media outlets

    Scenario: Contact page shows support information
        When I am on the contact page
        Then the contact page should show the support email and phone number

    Scenario: SHOWTIMES nav link navigates to the calendar page
        When I am on the home page
        Then the home page should be loaded
        And clicking the SHOWTIMES nav link should open the calendar page

    Scenario: COMING SOON nav link navigates to the coming soon page
        When I am on the home page
        Then the home page should be loaded
        And clicking the COMING SOON nav link should open the coming soon page
