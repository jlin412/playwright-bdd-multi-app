Feature: Fake Store API - products

    @smoke @api
    Scenario: Create a new product
        Given the Fake Store products API is reachable
        When I create a product titled "Playwright Fake Store Product"
        Then the created product should match the submitted payload

    @smoke @api
    Scenario: Get the product catalog
        Given the Fake Store products API is reachable
        When I request all products
        Then the response should be a list of products

    @regression @api
    Scenario: Get a single product
        Given the Fake Store products API is reachable
        When I request product 1
        Then the product details should include rating metadata

    @regression @api
    Scenario: Update a product
        Given the Fake Store products API is reachable
        When I update product 21 to title "Playwright Updated Product"
        Then the updated product should match the submitted payload

    @regression @api
    Scenario: Delete a product
        Given the Fake Store products API is reachable
        When I delete product 21
        Then the delete request should complete without a server error