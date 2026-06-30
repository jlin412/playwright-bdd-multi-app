Feature: Pet Store API - users

    @smoke @api
    Scenario: Create and retrieve a user
        Given the Pet Store API is reachable
        When I create a user with username "smokeuser"
        Then the user "smokeuser" should be retrievable

    @smoke @api
    Scenario: Login with valid credentials
        Given the Pet Store API is reachable
        When I create a user with username "loginuser"
        And I log in as "loginuser" with password "password123"
        Then the login should succeed with a token

    @regression @api
    Scenario: Update a user
        Given the Pet Store API is reachable
        When I create a user with username "updateuser"
        And I update the user firstName to "UpdatedFirst"
        Then the user "updateuser" should be retrievable

    @regression @api
    Scenario: Delete a user
        Given the Pet Store API is reachable
        When I create a user with username "deleteuser"
        And I delete the user "deleteuser"
        Then the user should not be found
