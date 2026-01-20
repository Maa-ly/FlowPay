//SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import {Intent} from "../src/intent.sol";
import {Escrow} from "../src/escrow.sol";
import {FactoryMech} from "../src/factory.sol";

contract DeploymentScript is Script{

    Intent intentImpl;
    Escrow escrowImpl;  
    FactoryMech factory;
    

    function run() external {
        
        vm.startBroadcast();
        // Deploy implementations
        intentImpl = new Intent();
        escrowImpl = new Escrow();
        // Deploy factory with implementation addresses
        factory = new FactoryMech(address(intentImpl), address(escrowImpl));
        createIntentClone();

        log();
        vm.stopBroadcast();
    }

    // function initialize() internal {
    //     intentImpl.initialize(msg.sender, address(escrowImpl));
    //     escrowImpl.initialize(msg.sender);
    // }

    function createIntentClone() public returns (address intentClone) {
        intentClone = factory.createIntentClone();
        console.log("Intent Clone Address:", intentClone);
    }   

    function log() public view {
        console.log("Intent Implementation Address:", address(intentImpl));
        console.log("Escrow Implementation Address:", address(escrowImpl));
        console.log("Factory Address:", address(factory));
    }


}
