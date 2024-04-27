// scripts/deploy_contracts.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy Token contract
    const Token = await hre.ethers.getContractFactory("OTToken");
    const token = await Token.deploy(deployer.address);
    
    await token.waitForDeployment();

    console.log("Token deployed to:", token.target);

    // Deploy TaskManager contract
    const TaskManager = await hre.ethers.getContractFactory("TaskManager");
    const taskManager = await TaskManager.deploy(token.target);
    await token.waitForDeployment();

    console.log("TaskManager deployed to:", taskManager.target);

    //Set the TaskManager contract as approved in the tokenMinter contract
    const approvalAmount = 1000000000000000;
    const approveTx = await token.connect(deployer).approve(taskManager.target, approvalAmount);
    await approveTx.wait(); // Wait for the approval transaction to be mined
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});