const { ethers } = require("hardhat");
require("dotenv").config();


async function main() {
  const OpenTribeToken = await ethers.getContractFactory("OpenTribeToken");
  const initialOwnerAddress = process.env.INITIAL_OWNER_ADDRESS;

  const openTribeToken = await OpenTribeToken.deploy(initialOwnerAddress);

  console.log("OpenTribeToken deployed to:", openTribeToken.target);

  const TaskManager = await ethers.getContractFactory("TaskManager");
  
  const taskManager = await TaskManager.deploy(
    openTribeToken.target,
    process.env.CHAINLINK_PROXY_ADDRESS
  );
  
  console.log("TaskManager deployed to:", taskManager.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

