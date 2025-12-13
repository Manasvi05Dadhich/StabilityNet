// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IImmuneReactable
 * @notice Interface for contracts that can respond to StabilityNet immune actions
 * @dev Any protocol module (governance, liquidity, treasury) can implement this
 */
interface IImmuneReactable {

    /**
     * @notice Triggered when the system enters a critical instability state
     * @param instabilityScore The confirmed median instability index (0–100)
     */
    function onImmuneActivate(uint256 instabilityScore) external;

    /**
     * @notice Triggered when the system exits the critical instability state
     */
    function onImmuneDeactivate() external;
}
