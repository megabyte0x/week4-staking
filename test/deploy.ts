import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Deploy", function () {
  async function fixture() {
    const REWARD_AMOUNT = ethers.utils.parseEther("1000");

    const [owner, user1, user2, user3] = await ethers.getSigners();

    return { owner, user1, user2, user3, REWARD_AMOUNT };
  }

  it("Should deploy a Megabyte", async function () {
    const { owner, user1, user2, user3 } = await loadFixture(fixture);

    const Megabyte = await ethers.getContractFactory("Megabyte");
    const megabyte = await Megabyte.deploy();
    await megabyte.deployed();

    expect(await megabyte.owner()).to.equal(owner.address);
  });

  it("Should deploy Stake Contract", async function () {
    const { owner, REWARD_AMOUNT } = await loadFixture(fixture);

    const Stake = await ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(REWARD_AMOUNT);
    await stake.deployed();

    const rewardAmount = await stake.rewardAmount();

    expect(rewardAmount).to.equal(REWARD_AMOUNT.toString());
  });
});
