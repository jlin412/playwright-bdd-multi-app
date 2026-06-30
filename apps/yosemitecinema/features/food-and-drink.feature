@regression @concessions
Feature: Food & drink ordering

    Background:
        Given I am on the Food & Drink page as a guest with one ticket

    Scenario: Required modifier warning blocks adding without a selection
        When I open the modifier dialog for "Sodas"
        Then the required modifier warning should be visible
        When I try to add the item without completing required modifiers
        Then the modifier dialog should still be open

    Scenario: Selecting a size modifier updates the dialog total
        When I open the modifier dialog for "Sodas"
        Then the dialog total should show "$6.25"
        When I select "Medium" from the modifier dialog
        Then the dialog total should show "$6.75"

    @smoke
    Scenario: Completing modifiers and confirming adds item to cart
        When I open the modifier dialog for "Sodas"
        And I select "Coke" from the modifier dialog
        Then the required modifier warning should not be visible
        When I confirm the modifier dialog
        Then the food cart should contain "Sodas"

    Scenario: Adding two simple items creates two cart lines
        When I add "Skittles" directly to the food cart
        And I add "Milk Duds" directly to the food cart
        Then the food cart should show at least 2 food items
