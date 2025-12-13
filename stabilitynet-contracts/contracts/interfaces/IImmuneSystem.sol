// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IImmuneSystem
 * @notice Interface for the on-chain immune response layer of StabilityNet
 * @dev Implemented by ImmuneSystem.sol
 */
interface IImmuneSystem {

    /**
     * @notice Activates protocol defenses when instability is confirmed
     * @param medianScore The median instability index (0–100)
     * @param submissionCount Number of valid submissions backing the median
     */
    function activateDefenses(
        uint256 medianScore,
        uint256 submissionCount
    ) external;

    /**
     * @notice Checks whether governance cooldown is active
     */
    function isCooldownActive() external view returns (bool);

    /**
     * @notice Checks whether liquidity guardrail is active
     */
    function isGuardrailActive() external view returns (bool);
}
