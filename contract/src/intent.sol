//SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;


struct PaymentIntent {
   address owner;
   address recipient;
   uint256 amount;        // payment amount (e.g. USDC)
   uint256 minBalance;    // safety buffer
   uint256 interval;      // execution interval in seconds
   uint256 lastExecuted;  // timestamp of last execution
   bool active;
}


 // make a factory , user can clone multiple intents?

contract Intent {
 

 mapping(uint256 => PaymentIntent) public intents;

 uint256[] public intentIds;

 mapping(address => uint256[]) public userIntents;

 uint256 public intentCount;

 event IntentCreated(uint256 intentId, address indexed owner, address indexed recipient, uint256 amount, uint256 minBalance);
 event IntentExecuted(uint256 intentId, uint256 timestamp);
 event IntentDeactivated(uint256 intentId);

    constructor() {
    }


    function createIntent(
        address recipient,
        uint256 amount,
        uint256 minBalance,
        uint256 interval

    ) public returns(uint256 intent_id){

      intent_id = intentCount++;
        intents[intent_id] = PaymentIntent({
            owner: msg.sender,
            recipient: recipient,
            amount: amount,
            minBalance: minBalance,
            interval: interval,
            lastExecuted: block.timestamp,
            active: true
        });
        userIntents[msg.sender].push(intent_id);

       emit IntentCreated(intent_id, msg.sender, recipient, amount, minBalance);
       return intent_id; 

    }



    function executeIntent(uint256 intentId) public {
        PaymentIntent storage paymentIntent = intents[intentId];
        require(paymentIntent.active, "Intent is not active");
        require(block.timestamp >= paymentIntent.lastExecuted + paymentIntent.interval, "Interval not reached");

         // pay recipient logic , question is how to handle the funds?
         // the reciepient could be something else than an EOA, could be a user without EOA
         // eg rent , phone bill, subscription etc.
         // for now we just update the last executed timestamp
         // talk to teammates about this part

         // so we can setup an escrow contract to hold the funds and pay out when executed
        paymentIntent.lastExecuted = block.timestamp;
        paymentIntent.active = false; // deactivate after 
        emit IntentExecuted(intentId, block.timestamp);
    }

    function deactivateIntent(uint256 intentId) public {
        PaymentIntent storage paymentIntent = intents[intentId];
        require(paymentIntent.owner == msg.sender, "Only owner can deactivate");
        paymentIntent.active = false;
        emit IntentDeactivated(intentId);
    }

    function getIntent(uint256 intentId) public view returns (PaymentIntent memory) {
        return intents[intentId];
    }

    function getUserIntents(address user) public view returns (uint256[] memory) {
        // we want return all active intents for a user
        uint256[] memory allIntents = userIntents[user];
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allIntents.length; i++) {
            if (intents[allIntents[i]].active) {
                activeCount++;
            }
        }

        uint256[] memory activeIntents = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allIntents.length; i++) {
            if (intents[allIntents[i]].active) {
                activeIntents[index] = allIntents[i];
                index++;
            }
        }

        return activeIntents;
    }

// usinng better way to get old intents, gas efficient
    function getOldIntents(address user) public view returns (uint256[] memory) {
        uint256[] memory allIntents = userIntents[user];
        uint256 oldCount = 0;
        for (uint256 i = 0; i < allIntents.length; i++) {
            if (!intents[allIntents[i]].active) {
                oldCount++;
            }
        }

        uint256[] memory oldIntents = new uint256[](oldCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allIntents.length; i++) {
            if (!intents[allIntents[i]].active) {
                oldIntents[index] = allIntents[i];
                index++;
            }
        }

        return oldIntents;
    }

}