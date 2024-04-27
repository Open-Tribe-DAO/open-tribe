// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TaskManager {
    IERC20 public token;

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

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function createTask(address assignee, uint256 reward) public {
        //Check if the wallet has sufficient allowance
        require(token.allowance(msg.sender, address(this)) >= reward, "Insufficient token allowance.");
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task(assignee, msg.sender, reward, false, false);
        token.transferFrom(msg.sender, address(this), reward);
        emit TaskCreated(taskId, assignee, reward);
    }

    function completeTask(uint256 taskId) public {
        //Only the creator of the contract can run this function
        require(msg.sender == tasks[taskId].creator, "Not authorized to complete task");
        //require(msg.sender == tasks[taskId].assignee, "You are not the assignee");
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
}
