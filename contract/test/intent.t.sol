// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "lib/forge-std/src/Test.sol";
import "../src/intent.sol";
import "../src/factory.sol";
import {console} from "lib/forge-std/src/console.sol";

contract IntentTestBase is Test {
    Intent public intent;
    FactoryMech public factory;

    uint256 amount = 1 ether;
    uint256 minBalance = 0.1 ether;
    uint256 interval = 3600; // 1 hour

    address alice = makeAddr("alice");
    address dave = makeAddr("dave");

    function setUp() public {
        intent = new Intent();
        factory = new FactoryMech(address(intent));
        deal(alice, 10 ether);
        deal(dave, 10 ether);
    }

    function cloneIntentForUser() public returns (address intentClone) {
        intentClone = factory.createIntentClone();

        console.log("Intent Clone Address:", intentClone);
    }

    function createIntent(address intent_, address recipient, uint256 amount, uint256 minBalance, uint256 interval)
        public
        returns (uint256)
    {
        (bool ok, bytes memory data) = intent_.call(
            abi.encodeWithSignature(
                "createIntent(address,uint256,uint256,uint256)", recipient, amount, minBalance, interval
            )
        );
        require(ok, "Create Intent failed");
        uint256 intentId = abi.decode(data, (uint256));

        return intentId;
    }

    function getIntent(address intent_, uint256 intentId) public returns (PaymentIntent memory) {
        (bool ok, bytes memory data) = intent_.call(abi.encodeWithSignature("getIntent(uint256)", intentId));
        require(ok, "Call failed");
        return abi.decode(data, (PaymentIntent));
    }

    function isIntentActive(address intent_, uint256 intentId) public returns (bool) {
        (bool ok, bytes memory data) = intent_.call(abi.encodeWithSignature("getIntent(uint256)", intentId));
        require(ok, "Call failed");
        PaymentIntent memory paymentIntent = abi.decode(data, (PaymentIntent));
        return paymentIntent.active;
    }

    function deactivateIntent(address intent_, uint256 intentId) public {
        (bool ok, bytes memory data) = intent_.call(abi.encodeWithSignature("deactivateIntent(uint256)", intentId));
        require(ok, "Deactivate failed");
        console.log("Intent Deactivated");
    }

    // function executeIntent(uint256 intentId) public {
    //     intent.executeIntent(intentId);
    //     console.log("Intent Executed");
    // }

    function getUserCurrentIntents(address intent_, address user) public returns (uint256[] memory) {
        (bool ok, bytes memory data) = intent_.call(abi.encodeWithSignature("getCurrentIntents(address)", user));
        require(ok, "Call failed");
        return abi.decode(data, (uint256[]));
    }

    function getUserOldIntents(address intent_, address user) public returns (uint256[] memory) {
        (bool ok, bytes memory data) = intent_.call(abi.encodeWithSignature("getOldIntents(address)", user));
        require(ok, "Call failed");
        return abi.decode(data, (uint256[]));
    }

    function test_CreateIntentClone() public {
        vm.prank(dave);
        address intentClone = cloneIntentForUser();
        assertTrue(intentClone != address(0), "Intent clone address should not be zero");
    }

    function test_CanCreateIntentandactive() public {
        vm.startPrank(dave);
        address intentClone = cloneIntentForUser();
        uint256 id_a = createIntent(intentClone, alice, amount, minBalance, interval);
        vm.stopPrank();

        bool data = isIntentActive(intentClone, id_a);
        PaymentIntent memory intentData = getIntent(intentClone, id_a);
        assertEq(intentData.owner, dave, "Owner should be Dave");
        assertEq(intentData.recipient, alice, "Recipient should be Alice");
        assertEq(id_a, 0, "Intent ID should be 0");
        assertTrue(data, "Intent should be active after creation");
    }

    // function test_can_ExecuteIntent() public {
    //     vm.prank(dave);
    //     uint256 id = createIntent(alice, amount, minBalance, interval);
    //     vm.warp(block.timestamp + interval + 1); // Move time forward to satisfy interval
    //     // assert intent is in new intents
    //     uint256[] memory currentIntents = getUserCurrentIntents(dave);
    //     bool foundInCurrent = false;
    //     for (uint256 i = 0; i < currentIntents.length; i++) {
    //         if (currentIntents[i] == id) {
    //             foundInCurrent = true;
    //             break;
    //         }
    //     }
    //     assertTrue(foundInCurrent, "Intent should be in current intents before execution");
    //     vm.prank(dave);
    //     executeIntent(id);
    //     PaymentIntent memory intentData = getIntent(id);
    //     assertEq(intentData.lastExecuted, block.timestamp, "lastExecuted should be updated to current timestamp");

    //     // assert intent is in old intents
    //     uint256[] memory oldIntents = getUserOldIntents(dave);
    //     bool found = false;
    //     for (uint256 i = 0; i < oldIntents.length; i++) {
    //         if (oldIntents[i] == id) {
    //             found = true;
    //             break;

    //         }
    //     }
    // }
}
