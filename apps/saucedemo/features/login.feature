@smoke @ui
Feature: SauceDemo login

    Scenario: Valid login reaches the products page
        Given I am on the login page
        When I log in as "standard_user"
        Then I should see the products page

    Scenario: Locked-out user is rejected
        Given I am on the login page
        When I log in as "locked_out_user"
        Then I should see a login error
