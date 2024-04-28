export const getShortAddress = (address?: string) => {
  if (!address) return ''
  const shortAddress = `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
  )}`;

  return shortAddress
}

export const TOKEN_MINTER_CONTRACT_ADDRESS = '0xFEa742547a8c0d2a70606B4106c5B20736BfCeD6'
export const TASK_MANAGER_CONTRACT_ADDRESS = '0x1B2539b195aF04f4EAb550650E588916aafA7F44'

export const weiToEth = (wei: number) => {
  const initialWei = Number(wei)
  const weiToEtherFactor = 1e18; // 10^18
  return `${initialWei / weiToEtherFactor} ETH`;
}