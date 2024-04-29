require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-ignition-ethers");
require('dotenv').config();

// Custom constants
const constants = {
  // Check this address at https://docs.chain.link/data-feeds/price-feeds/addresses?network=scroll&page=1
  chainlink_eth_to_usd_address: process.env.CHAINLINK_PROXY_ADDRESS,
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    scrollSepolia: {
      gasPrice: 700000000,
      url: "https://sepolia-rpc.scroll.io/" || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.EXPLORER_API_KEY,
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
    ],
  },

  solidity: "0.8.23",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    scripts: "./scripts",
  },
  mocha: {
    timeout: 40000,
  },
  constants,
};
