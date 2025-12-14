import { parseAbi } from 'viem';

export const uniswapV2PairAbi = parseAbi([
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
]);

export const erc20Abi = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 value)'
]);

export const governorAbi = parseAbi([
  // OpenZeppelin GovernorCountingSimple-compatible
  'event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)'
]);

export const stabilityOracleAbi = parseAbi([
  'function publishScore(uint256 score) external',
  'function setAllowedSource(address _newSource) external',
  'function getGlobalIndex() view returns (uint256)',
  'function isCooldownActive() view returns (bool)',
  'function isGuardrailActive() view returns (bool)',
  'event StabilityAlert(uint256 score, uint256 timestamp, address indexed reporter)'
]);
