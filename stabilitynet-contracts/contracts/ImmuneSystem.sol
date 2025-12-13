// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./interfaces/IImmuneReactable.sol";


contract ImmuneSystem {

    /* ------------------------------------------------------------ */
    /*                         CONFIGURATION                        */
    /* ------------------------------------------------------------ */

    uint256 public constant COOLDOWN_BLOCKS = 50;     // ~10–15 minutes on testnet
    uint256 public constant MIN_SUBMISSIONS = 3;      // minimum reports required

    /* ------------------------------------------------------------ */
    /*                         STATE VARIABLES                      */
    /* ------------------------------------------------------------ */

    address public oracle;                // StabilityOracle contract

    bool public governanceCooldownActive;
    bool public liquidityGuardrailActive;

    uint256 public cooldownEndBlock;
    uint256 public lastActivatedScore;

    /* ------------------------------------------------------------ */
    /*                              EVENTS                          */
    /* ------------------------------------------------------------ */

    event ImmuneSystemActivated(uint256 score, uint256 untilBlock);
    event ImmuneSystemDeactivated();

    /* ------------------------------------------------------------ */
    /*                            MODIFIERS                         */
    /* ------------------------------------------------------------ */

    modifier onlyOracle() {
        require(msg.sender == oracle, "Caller is not oracle");
        _;
    }

    /* ------------------------------------------------------------ */
    /*                           CONSTRUCTOR                        */
    /* ------------------------------------------------------------ */

    constructor(address _oracle) {
        require(_oracle != address(0), "Invalid oracle");
        oracle = _oracle;
    }

    /* ------------------------------------------------------------ */
    /*                     CORE IMMUNE ACTIVATION                  */
    /* ------------------------------------------------------------ */

    /**
     * @notice Called ONLY by StabilityOracle
     * @param medianScore Median instability score
     * @param submissionCount Number of valid submissions used
     */
    function activateDefenses(
        uint256 medianScore,
        uint256 submissionCount
    ) external onlyOracle {

        // Require enough independent submissions
        require(submissionCount >= MIN_SUBMISSIONS, "Not enough submissions");

        // Prevent re-activation spam if already active
        if (governanceCooldownActive || liquidityGuardrailActive) {
            return;
        }

        governanceCooldownActive = true;
        liquidityGuardrailActive = true;

        cooldownEndBlock = block.number + COOLDOWN_BLOCKS;
        lastActivatedScore = medianScore;

        emit ImmuneSystemActivated(medianScore, cooldownEndBlock);
    }

    /* ------------------------------------------------------------ */
    /*                   DEFENSE LIFECYCLE CONTROL                  */
    /* ------------------------------------------------------------ */

    function checkAndDeactivate() external {
        if (
            governanceCooldownActive &&
            block.number >= cooldownEndBlock
        ) {
            governanceCooldownActive = false;
            liquidityGuardrailActive = false;

            emit ImmuneSystemDeactivated();
        }
    }

    /* ------------------------------------------------------------ */
    /*                     READ-ONLY VIEW HELPERS                   */
    /* ------------------------------------------------------------ */

    function isCooldownActive() external view returns (bool) {
        return governanceCooldownActive;
    }

    function isGuardrailActive() external view returns (bool) {
        return liquidityGuardrailActive;
    }
}
