require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    scrollsepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: ['920ecc997289519b228019a3ce4d11982c3c151ede1fa0b51c479ae78a16163d']
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
};
