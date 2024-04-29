export const getShortAddress = (address?: string) => {
  if (!address) return ''
  const shortAddress = `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
  )}`;

  return shortAddress
}

export const TOKEN_MINTER_CONTRACT_ADDRESS =
  "0xA486118610CfAF9ca28d207F841062363C6AF804";
export const TASK_MANAGER_CONTRACT_ADDRESS =
  "0x1363D7Da572aB869C6af2bD647D9fe67035E82e0";

export const weiToEth = (wei: number) => {
  const initialWei = Number(wei)
  const weiToEtherFactor = 1e18; // 10^18
  return `${initialWei / weiToEtherFactor} ETH`;
}