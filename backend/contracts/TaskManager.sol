// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TaskManager {
    IERC20 public token;
    AggregatorV3Interface internal priceFeed;

    struct Task {
        address assignee;
        address creator;
        uint256 reward;
        bool isCompleted;
        bool isCancelled;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public nextTaskId;

    event TaskCreated(uint256 taskId, address assignee, uint256 reward);
    event TaskCompleted(uint256 taskId);
    event TaskCancelled(uint256 taskId);

    constructor(address tokenAddress, address priceFeedAddress) {
        token = IERC20(tokenAddress);
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function getLatestEthPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return answer;
    }

    function usdToEth(uint256 usdAmount) public view returns (uint256) {
        int ethPrice = getLatestEthPrice(); // Price of 1 ETH in USD
        require(ethPrice > 0, "Invalid ETH price");
        return (usdAmount * 1e18) / uint256(ethPrice);
    }

    function createTask(address assignee, uint256 reward) public {
        require(token.allowance(msg.sender, address(this)) >= reward, "Insufficient token allowance.");
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task(assignee, msg.sender, reward, false, false);
        token.transferFrom(msg.sender, address(this), reward);
        emit TaskCreated(taskId, assignee, reward);
    }

    function completeTask(uint256 taskId) public {
        require(msg.sender == tasks[taskId].creator, "Not authorized to complete task");
        require(!tasks[taskId].isCompleted, "Task already completed");
        require(!tasks[taskId].isCancelled, "Task has been cancelled");

        tasks[taskId].isCompleted = true;
        token.transfer(tasks[taskId].assignee, tasks[taskId].reward);
        emit TaskCompleted(taskId);
    }

    function cancelTask(uint256 taskId) public {
        require(!tasks[taskId].isCompleted, "Task already completed");
        require(!tasks[taskId].isCancelled, "Task has been cancelled");

        tasks[taskId].isCancelled = true;
        token.transfer(msg.sender, tasks[taskId].reward);
        emit TaskCancelled(taskId);
    }

    function checkAllowance(address owner, uint256 rewardAmount) public view returns (bool) {
        uint256 allowance = token.allowance(owner, address(this));
        return allowance >= rewardAmount;
    }

    function getAllTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = new Task[](nextTaskId);
        for (uint256 i = 0; i < nextTaskId; i++) {
            allTasks[i] = tasks[i];
        }
        return allTasks;
    }
}
