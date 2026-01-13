// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract FactoryMech {
    address public immutable intentImplementation;
    address public immutable escrowImplementation;

    mapping(address => address[]) public userIntents;

    event IntentCloneCreated(address indexed user, address intentClone);

    constructor(address _intentImpl, address _escrowImpl) {
        intentImplementation = _intentImpl;
        escrowImplementation = _escrowImpl;
    }

    function createIntentClone() external returns (address intentClone) {
        intentClone = Clones.clone(intentImplementation);

        // initialize clone
        (bool ok,) = intentClone.call(
            abi.encodeWithSignature(
                "initialize(address,address)",
                msg.sender,
                escrowImplementation
            )
        );
        require(ok, "Init failed");

        userIntents[msg.sender].push(intentClone);
        emit IntentCloneCreated(msg.sender, intentClone);
    }

    function getUserIntents(address user)
        external
        view
        returns (address[] memory)
    {
        return userIntents[user];
    }
}
