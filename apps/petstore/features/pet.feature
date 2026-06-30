Feature: Pet Store API - pets

    @smoke @api
    Scenario: Create and retrieve a pet
        Given the Pet Store API is reachable
        When I create a pet named "Playwright Pup"
        Then the pet should be retrievable by id

    @smoke @api
    Scenario: Find pets by status
        Given the Pet Store API is reachable
        When I request pets with status "available"
        Then the response should be a list of pets

    @regression @api
    Scenario: Update a pet name and status
        Given the Pet Store API is reachable
        When I create a pet named "UpdateMe"
        And I update the pet to name "UpdatedName" with status "pending"
        Then the pet should be retrievable by id

    @regression @api
    Scenario: Delete a pet
        Given the Pet Store API is reachable
        When I create a pet named "DeleteMe"
        And I delete the pet
        Then the pet should not be found
