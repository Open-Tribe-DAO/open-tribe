require("@nomicfoundation/hardhat-ethers");
const { expect } = require("chai");

describe("TaskManager Contract", function () {
  let TaskManager;
  let taskManager;
  let owner;
  let assignee;
  let accounts;
  let token;
  let amount;

  before(async function () {
    [owner, assignee, ...accounts] = await ethers.getSigners();

    const OTToken = await ethers.getContractFactory("OTToken");
    token = await OTToken.deploy(owner.address);

    await token.mint(owner.address, ethers.parseUnits("1000", "ether"));

    amount = ethers.parseUnits("100", "ether");
  });

  beforeEach(async function () {
    TaskManager = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManager.deploy(token.target);

    await token.connect(owner).approve(taskManager.target, amount);
  });

  describe("Deployment", function () {
    it("Should associate with the OTToken", async function () {
      expect(await taskManager.token()).to.equal(token.target);
    });
  });

  describe("Managing Tasks", function () {
    it("Should create a task correctly", async function () {
      await expect(
        taskManager.connect(owner).createTask(assignee.address, amount)
      )
        .to.emit(taskManager, "TaskCreated")
        .withArgs(0, assignee.address, amount);

      const task = await taskManager.tasks(0);
      expect(task.assignee).to.equal(assignee.address);
      expect(task.reward.toString()).to.equal(amount.toString());
      expect(task.isCompleted).to.be.false;
      expect(task.isCancelled).to.be.false;
    });

    it("Should complete a task correctly", async function () {
      await taskManager.connect(owner).createTask(assignee.address, amount);
      await expect(taskManager.connect(owner).completeTask(0))
        .to.emit(taskManager, "TaskCompleted")
        .withArgs(0);

      const task = await taskManager.tasks(0);
      expect(task.isCompleted).to.be.true;
    });

    it("Should cancel a task correctly", async function () {
      await taskManager.connect(owner).createTask(assignee.address, amount);
      await expect(taskManager.connect(owner).cancelTask(0))
        .to.emit(taskManager, "TaskCancelled")
        .withArgs(0);

      const task = await taskManager.tasks(0);
      expect(task.isCancelled).to.be.true;
    });
  });
});
