// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IImmuneSystem.sol";

contract StabilityOracle {

    /* ------------------------------------------------------------ */
    /*                         CONFIGURATION                        */
    /* ------------------------------------------------------------ */

    uint256 public constant DANGER_THRESHOLD = 75;
    uint256 public constant WINDOW_DURATION = 10 minutes;

    /* ------------------------------------------------------------ */
    /*                         STATE VARIABLES                      */
    /* ------------------------------------------------------------ */

    uint256 public lastScore;
    uint256 public lastUpdated;

    address public immuneSystem;
    address public allowedSource;

    struct Submission {
        uint256 score;
        uint256 timestamp;
    }

    Submission[] public submissions;

    /* ------------------------------------------------------------ */
    /*                              EVENTS                          */
    /* ------------------------------------------------------------ */

    event StabilityAlert(uint256 score, uint256 timestamp);
    event ScoreSubmitted(address indexed source, uint256 score);

    /* ------------------------------------------------------------ */
    /*                            MODIFIERS                         */
    /* ------------------------------------------------------------ */

    modifier onlyAllowedSource() {
        require(msg.sender == allowedSource, "Not authorized");
        _;
    }

    /* ------------------------------------------------------------ */
    /*                           CONSTRUCTOR                        */
    /* ------------------------------------------------------------ */

    constructor(address _allowedSource) {
        require(_allowedSource != address(0), "Invalid source");
        allowedSource = _allowedSource;
    }

    /* ------------------------------------------------------------ */
    /*                        ADMIN FUNCTIONS                       */
    /* ------------------------------------------------------------ */

    function setImmuneSystem(address _immuneSystem) external {
        require(_immuneSystem != address(0), "Invalid address");
        immuneSystem = _immuneSystem;
    }

    function setAllowedSource(address _newSource) external {
        require(_newSource != address(0), "Invalid address");
        allowedSource = _newSource;
    }

    /* ------------------------------------------------------------ */
    /*                       CORE ORACLE FUNCTION                   */
    /* ------------------------------------------------------------ */

    function publishScore(uint256 score) external onlyAllowedSource {
        require(score <= 100, "Score must be <= 100");

        // 1. Store submission
        submissions.push(
            Submission({
                score: score,
                timestamp: block.timestamp
            })
        );

        emit ScoreSubmitted(msg.sender, score);

        // 2. Prune old submissions
        _pruneOldSubmissions();

        // 3. Calculate median ALWAYS
        uint256 medianScore = _calculateMedian();

        lastScore = medianScore;
        lastUpdated = block.timestamp;

        // 4. Emit alert only if threshold crossed
        if (medianScore >= DANGER_THRESHOLD) {
            emit StabilityAlert(medianScore, block.timestamp);
        }

        // 5. Activate immune system ONLY if quorum reached
        if (
            submissions.length >= 3 &&
            medianScore >= DANGER_THRESHOLD &&
            immuneSystem != address(0)
        ) {
            IImmuneSystem(immuneSystem).activateDefenses(
                medianScore,
                submissions.length
            );
        }
    }

    /* ------------------------------------------------------------ */
    /*                     INTERNAL MEDIAN LOGIC                    */
    /* ------------------------------------------------------------ */

    function _pruneOldSubmissions() internal {
        uint256 i = 0;
        while (i < submissions.length) {
            if (submissions[i].timestamp < block.timestamp - WINDOW_DURATION) {
                submissions[i] = submissions[submissions.length - 1];
                submissions.pop();
            } else {
                i++;
            }
        }
    }

    function _calculateMedian() internal view returns (uint256) {
        uint256 len = submissions.length;
        require(len > 0, "No submissions");

        uint256[] memory scores = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            scores[i] = submissions[i].score;
        }

        _sort(scores);

        if (len % 2 == 1) {
            return scores[len / 2];
        } else {
            return (scores[len / 2] + scores[(len / 2) - 1]) / 2;
        }
    }

    function _sort(uint256[] memory arr) internal pure {
        uint256 n = arr.length;
        for (uint256 i = 0; i < n; i++) {
            for (uint256 j = i + 1; j < n; j++) {
                if (arr[j] < arr[i]) {
                    (arr[i], arr[j]) = (arr[j], arr[i]);
                }
            }
        }
    }
}
