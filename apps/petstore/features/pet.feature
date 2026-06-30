@smoke @api
Feature: Pet Store API - pets

    Scenario: Create and retrieve a pet
        Given the Pet Store API is reachable
        When I create a pet named "Playwright Pup"
        Then the pet should be retrievable by id

    Scenario: Find pets by status
        Given the Pet Store API is reachable
        When I request pets with status "available"
        Then the response should be a list of pets
