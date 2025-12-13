

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {StabilityOracle} from "../contracts/StabilityOracle.sol";

contract Deploy is Script {
    // Existing ImmuneSystem on Sepolia
    address constant EXISTING_IMMUNE_SYSTEM =
        0xD53f40B0C59c8C9908d9b205BfE564B60fBdfc0e;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        /* ------------------------------------------------------------ */
        /* 1. Deploy NEW StabilityOracle (fixed logic)                  */
        /* ------------------------------------------------------------ */

        // Deployer is initial allowed source
        StabilityOracle oracle = new StabilityOracle(deployer);

        /* ------------------------------------------------------------ */
        /* 2. Wire Oracle -> EXISTING ImmuneSystem                      */
        /* ------------------------------------------------------------ */

        oracle.setImmuneSystem(EXISTING_IMMUNE_SYSTEM);

        vm.stopBroadcast();

        /* ------------------------------------------------------------ */
        /* 3. Log deployed address                                     */
        /* ------------------------------------------------------------ */

        console.log("NEW StabilityOracle deployed at:", address(oracle));
        console.log("ImmuneSystem reused at:", EXISTING_IMMUNE_SYSTEM);
    }
}
