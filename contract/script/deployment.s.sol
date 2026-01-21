//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {Intent} from "../src/intent.sol";
import {FactoryMech} from "../src/factory.sol";

contract DeploymentScript is Script {
    Intent intentImpl;
    FactoryMech factory;

    function run() external {
        vm.startBroadcast();
        // Deploy implementations
        intentImpl = new Intent();
        // Deploy factory with implementation addresses
        factory = new FactoryMech(address(intentImpl));
        createIntentClone();

        log();
        vm.stopBroadcast();
    }

    function createIntentClone() public returns (address intentClone) {
        intentClone = factory.createIntentClone();
        console.log("Intent Clone Address:", intentClone);
    }

    function log() public view {
        console.log("Intent Implementation Address:", address(intentImpl));
        console.log("Factory Address:", address(factory));
    }
}
