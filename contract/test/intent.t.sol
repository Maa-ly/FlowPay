// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.30;

// import {Test} from "lib/forge-std/src/Test.sol";
// import "../src/intent.sol";
// import {console} from "lib/forge-std/src/console.sol";

// contract IntentTestBase is Test {
//     Intent public intent;

//     uint256 amount = 1 ether;
//     uint256 minBalance = 0.1 ether;
//     uint256 interval = 3600; // 1 hour

//     address alice = makeAddr("alice");
//     address dave = makeAddr("dave");

//     function setUp() public {
//         intent = new Intent();
//         deal(alice, 10 ether);
//         deal(dave, 10 ether);
//     }

//     function createIntent(address recipient, uint256 amount, uint256 minBalance, uint256 interval) public returns (uint256) {
//         uint256 intentId = intent.createIntent(recipient, amount, minBalance, interval);
//         return intentId; 
//     }

//     function getIntent(uint256 intentId) public view returns (PaymentIntent memory) {
//         return intent.getIntent(intentId);
//     }

//     function isIntentActive(uint256 intentId) public view returns (bool) {
//         PaymentIntent memory paymentIntent = intent.getIntent(intentId);
//         return paymentIntent.active;
//     }


//     function deactivateIntent(uint256 intentId) public {
//         intent.deactivateIntent(intentId);
//         console.log("Intent Deactivated");
//     }
//     function executeIntent(uint256 intentId) public {
//         intent.executeIntent(intentId);
//         console.log("Intent Executed");
//     }

 
//     function getUserCurrentIntents(address user) public view returns (uint256[] memory) {
//         return intent.getUserIntents(user);

//     }

//     function getUserOldIntents(address user) public view returns (uint256[] memory) {
//         return intent.getOldIntents(user);

//     }


//     function test_CanCreateIntentandactive() public {
//         vm.prank(dave);
//         uint256 id = createIntent(alice, amount, minBalance, interval);
//         bool data = isIntentActive(id);
//         vm.prank(alice);
//         uint256 id_a = createIntent(alice, amount, minBalance, interval);
  
//        PaymentIntent memory intentData = getIntent(id_a);
//         assertEq(intentData.owner, alice, "Owner should be Alice");
//         assertEq(intentData.recipient, alice, "Recipient should be Alice");   
//         assertEq(id_a,1, "Intent ID should be one"); 
//         assertEq(id, 0, "Intent ID should  be zero");
//         assertTrue(data, "Intent should be active after creation");
//     }

//     function test_can_ExecuteIntent() public {
//         vm.prank(dave);
//         uint256 id = createIntent(alice, amount, minBalance, interval);
//         vm.warp(block.timestamp + interval + 1); // Move time forward to satisfy interval
//         // assert intent is in new intents
//         uint256[] memory currentIntents = getUserCurrentIntents(dave);
//         bool foundInCurrent = false;
//         for (uint256 i = 0; i < currentIntents.length; i++) {
//             if (currentIntents[i] == id) {
//                 foundInCurrent = true;      
//                 break;
//             }
//         }
//         assertTrue(foundInCurrent, "Intent should be in current intents before execution");
//         vm.prank(dave);
//         executeIntent(id);
//         PaymentIntent memory intentData = getIntent(id);
//         assertEq(intentData.lastExecuted, block.timestamp, "lastExecuted should be updated to current timestamp");

//         // assert intent is in old intents
//         uint256[] memory oldIntents = getUserOldIntents(dave);
//         bool found = false;
//         for (uint256 i = 0; i < oldIntents.length; i++) {
//             if (oldIntents[i] == id) {
//                 found = true;
//                 break;         

//             }
//         }
//     }
// }
