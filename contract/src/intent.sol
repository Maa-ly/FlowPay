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
   // frequency ?
}


 // make a factory , user can clone multiple intents?

contract Intent {
 
    address public owner;
    address public escrowImpl;
    bool public initialized;

 mapping(uint256 => PaymentIntent) public intents;

 uint256[] public intentIds;

 mapping(address => uint256[]) public userIntents;

 uint256 public intentCount;

 event IntentCreated(uint256 intentId, address indexed owner, address indexed recipient, uint256 amount, uint256 minBalance);
 event IntentExecuted(uint256 intentId, uint256 timestamp);
 event IntentDeactivated(uint256 intentId);

    constructor() {
    }



    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function initialize(address _owner, address _escrowImpl) external {
        require(!initialized, "Already initialized");
        initialized = true;

        owner = _owner;
        escrowImpl = _escrowImpl;
    }


    function createIntent(
        address recipient,
        uint256 amount,
        uint256 minBalance,
        uint256 interval

    ) public onlyOwner returns(uint256 intent_id){

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



//x402 calls

    // function executeIntent(uint256 intentId) public {
    //     PaymentIntent storage paymentIntent = intents[intentId];
    //     require(paymentIntent.active, "Intent is not active");
    //     require(block.timestamp >= paymentIntent.lastExecuted + paymentIntent.interval, "Interval not reached");
    //     // check threshold balance

    //     //
    //      // usdc ----- eoa --- rent --- card -- an invoce? 
    //      // user tryna send ton or make intent does does accept crpto or have eoa
    //      // pay recipient logic , question is how to handle the funds?
    //      // the reciepient could be something else than an EOA, could be a user without EOA
    //      // eg rent , phone bill, subscription etc.
    //      // for now we just update the last executed timestamp
    //      // talk to teammates about this part
    
    //      // so we can setup an escrow contract to hold the funds and pay out when executed
    //      // transfer funds to escrow contract
    //      // call escrow release function to pay recipient
    //     paymentIntent.lastExecuted = block.timestamp;
    //     paymentIntent.active = false; // deactivate after 
    //     emit IntentExecuted(intentId, block.timestamp);
    // }

    function deactivateIntent(uint256 intentId) public {
        PaymentIntent storage paymentIntent = intents[intentId];
        require(paymentIntent.owner == msg.sender, "Only owner can deactivate");
        paymentIntent.active = false;
        emit IntentDeactivated(intentId);
    }

    function canExecute(uint256 id, uint256 balance)
        public
        view
        returns (bool)
    {
        PaymentIntent memory p = intents[id];
        if (!p.active) return false;
        if (block.timestamp < p.lastExecuted + p.interval) return false;
        if (balance < p.amount + p.minBalance) return false;
        return true;
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