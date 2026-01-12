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


contract Intent {
 

 mapping(uint256 => PaymentIntent) public intents;

 uint256 public intentCount;

 event IntentCreated(uint256 intentId, address indexed owner, address indexed recipient, uint256 amount, uint256 minBalance);
    

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

       emit IntentCreated(intent_id, msg.sender, recipient, amount, minBalance);
       return intent_id; 

    }

    function getIntent(uint256 intentId) public view returns (PaymentIntent memory) {
        return intents[intentId];
    }

    function getUserIntents(address user) public view returns (uint256[] memory) {
        uint256[] memory userIntents = new uint256[](intentCount);
        uint256 count = 0;
        for (uint256 i = 0; i < intentCount; i++) {
            if (intents[i].owner == user && intents[i].active) {
                userIntents[count] = i;
                count++;
            }
        }
        // Resize the array to the actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = userIntents[j];
        }
        return result;
    }

    function getOldIntents(address user) public view returns (uint256[] memory) {
        uint256[] memory oldIntents = new uint256[](intentCount);
        uint256 count = 0;
        for (uint256 i = 0; i < intentCount; i++) {
            if (intents[i].owner == user && !intents[i].active) {
                oldIntents[count] = i;
                count++;
            }
        }
        // Resize the array to the actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = oldIntents[j];
        }
        return result;
    }

}