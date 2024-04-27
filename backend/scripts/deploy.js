// scripts/deploy_contracts.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    //console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy Token contract
    const Token = await hre.ethers.getContractFactory("OTToken");
    const token = await Token.deploy(deployer.address);
    
    await token.deployTransaction.wait(1);
    //await token.deployed();

    console.log("Token deployed to:", token.target);

    // // Deploy TaskManager contract
    // const TaskManager = await hre.ethers.getContractFactory("TaskManager");
    // const taskManager = await TaskManager.deploy(token.target);
    // //await taskManager.deployed();
    // //await taskManager.deployTransaction.wait();

    // console.log("TaskManager deployed to:", taskManager.address);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});