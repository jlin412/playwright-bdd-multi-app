Feature: Pet Store API - store

    @smoke @api
    Scenario: Inventory reports status counts
        Given the Pet Store API is reachable
        When I request the store inventory
        Then the inventory should report numeric status counts

    @smoke @api
    Scenario: Place and retrieve an order
        Given the Pet Store API is reachable
        When I place an order for pet 1
        Then the order should be retrievable by id

    @regression @api
    Scenario: Delete an order
        Given the Pet Store API is reachable
        When I place an order for pet 1
        And I delete the order
        Then the order should not be found
