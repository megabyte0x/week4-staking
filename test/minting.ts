import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Minting, Set address and Approve", function () {
  async function fixture() {
    const REWARD_AMOUNT = ethers.utils.parseEther("1000");

    const [owner, user1, user2, user3] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(REWARD_AMOUNT);
    await stake.deployed();

    const Megabyte = await ethers.getContractFactory("Megabyte");
    const megabyte = await Megabyte.deploy();
    await megabyte.deployed();

    return { owner, user1, user2, user3, REWARD_AMOUNT, megabyte, stake };
  }

  it("Should set addresses for token Contract", async function () {
    const { owner, stake } = await loadFixture(fixture);

    await stake.connect(owner).setTokenAddress(stake.address);

    expect(await stake.getTokenAddres()).to.equal(stake.address);
  });

  it("Should mint token for different Accounts", async function () {
    const { owner, user1, user2, user3, megabyte } = await loadFixture(fixture);

    await megabyte.mint(user1.address, ethers.utils.parseEther("100"));
    await megabyte.mint(user2.address, ethers.utils.parseEther("100"));
    await megabyte.mint(user3.address, ethers.utils.parseEther("100"));

    expect(await megabyte.balanceOf(user1.address)).to.equal(
      ethers.utils.parseEther("100")
    );
    expect(await megabyte.balanceOf(user2.address)).to.equal(
      ethers.utils.parseEther("100")
    );
    expect(await megabyte.balanceOf(user3.address)).to.equal(
      ethers.utils.parseEther("100")
    );
  });

  it("Should approve token for staking", async function () {
    const { owner, user1, user2, user3, megabyte, stake } = await loadFixture(
      fixture
    );

    await megabyte
      .connect(user1)
      .approve(stake.address, ethers.utils.parseEther("100"));
    await megabyte
      .connect(user2)
      .approve(stake.address, ethers.utils.parseEther("100"));
    await megabyte
      .connect(user3)
      .approve(stake.address, ethers.utils.parseEther("100"));

    expect(await megabyte.allowance(user1.address, stake.address)).to.equal(
      ethers.utils.parseEther("100")
    );
    expect(await megabyte.allowance(user2.address, stake.address)).to.equal(
      ethers.utils.parseEther("100")
    );
    expect(await megabyte.allowance(user3.address, stake.address)).to.equal(
      ethers.utils.parseEther("100")
    );
  });
});
