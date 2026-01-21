// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract FactoryMech {
    address public immutable intentImplementation;

    mapping(address => address[]) public userIntents;

    event IntentCloneCreated(address indexed user, address intentClone);

    constructor(address _intentImpl) {
        intentImplementation = _intentImpl;
    }

    function createIntentClone() external returns (address intentClone) {
        intentClone = Clones.clone(intentImplementation);

        // initialize clone
        (bool ok,) = intentClone.call(abi.encodeWithSignature("initialize(address)", msg.sender));
        require(ok, "Init failed");

        userIntents[msg.sender].push(intentClone);
        emit IntentCloneCreated(msg.sender, intentClone);
    }

    function getUserIntents(address user) external view returns (address[] memory) {
        return userIntents[user];
    }
}
