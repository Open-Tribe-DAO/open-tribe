require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();

// Custom constants
const constants = {
  // Check this address at https://docs.chain.link/data-feeds/price-feeds/addresses?network=scroll&page=1
  chainlink_eth_to_usd_address: "0x1234567890abcdef1234567890abcdef12345678",
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    scrollsepolia: {
      gasPrice: 700000000,
      url: "https://sepolia-rpc.scroll.io/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
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
