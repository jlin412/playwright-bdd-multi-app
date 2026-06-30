@smoke @api
Feature: Pet Store API - store

    Scenario: Inventory reports status counts
        Given the Pet Store API is reachable
        When I request the store inventory
        Then the inventory should report numeric status counts
