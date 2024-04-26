export const getShortAddress = (address?: string) => {
  if (!address) return ''
  const shortAddress = `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
  )}`;

  return shortAddress
}