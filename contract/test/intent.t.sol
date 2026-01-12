// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "lib/forge-std/src/Test.sol";
import "../src/intent.sol";

contract IntentTestBase is Test {
    Intent public intent;

    uint256 amount = 1 ether;
    uint256 minBalance = 0.1 ether;
    uint256 interval = 3600; // 1 hour

    address alice = makeAddr("alice");
    address dave = makeAddr("dave");

    function setUp() public {
        intent = new Intent();
        deal(alice, 10 ether);
        deal(dave, 10 ether);
    }

    function createIntent(address recipient, uint256 amount, uint256 minBalance, uint256 interval) public returns (uint256) {
        uint256 intentId = intent.createIntent(recipient, amount, minBalance, interval);
        return intentId; 
    }

    function getIntent(uint256 intentId) public view returns (PaymentIntent memory) {
        return intent.getIntent(intentId);
    }

    function isIntentActive(uint256 intentId) public view returns (bool) {
        PaymentIntent memory paymentIntent = intent.getIntent(intentId);
        return paymentIntent.active;
    }

    function test_CanCreateIntentandactive() public {
        vm.prank(dave);
        uint256 id = createIntent(alice, amount, minBalance, interval);
        bool data = isIntentActive(id);
        vm.prank(alice);
        uint256 id_a = createIntent(alice, amount, minBalance, interval);
  
       PaymentIntent memory intentData = getIntent(id_a);
        assertEq(intentData.owner, alice, "Owner should be Alice");
        assertEq(intentData.recipient, alice, "Recipient should be Alice");   
        assertEq(id_a,1, "Intent ID should be one"); 
        assertEq(id, 0, "Intent ID should  be zero");
        assertTrue(data, "Intent should be active after creation");
    }
}
