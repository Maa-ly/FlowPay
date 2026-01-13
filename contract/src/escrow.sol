// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Escrow {
    address public intent;
    bool public initialized;

    modifier onlyIntent() {
        require(msg.sender == intent, "Only intent");
        _;
    }

    function initialize(address _intent) external {
        require(!initialized);
        initialized = true;
        intent = _intent;
    }

    function release(address recipient, uint256 amount)
        external
        onlyIntent
    {
        // x402 settlement logic here
        // token transfer / facilitator call
    }
}



