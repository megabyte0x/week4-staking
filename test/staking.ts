import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  async function fixture() {
    const REWARD_AMOUNT = ethers.utils.parseEther("1000");

    const [owner, user1, user2, user3] = await ethers.getSigners();

    const Stake = await ethers.getContractFactory("Stake");
    const stake = await Stake.deploy(REWARD_AMOUNT);
    await stake.deployed();
    console.log("Stake Contract Deployed");

    const Megabyte = await ethers.getContractFactory("Megabyte");
    const megabyte = await Megabyte.deploy();
    await megabyte.deployed();
    console.log("Megabyte Contract Deployed");

    await stake.connect(owner).setTokenAddress(megabyte.address);
    console.log("Token Address setted");

    await megabyte.mint(user1.address, ethers.utils.parseEther("100"));
    await megabyte.mint(user2.address, ethers.utils.parseEther("100"));
    await megabyte.mint(user3.address, ethers.utils.parseEther("100"));
    console.log("Minted 100 tokens to each user");

    await megabyte
      .connect(user1)
      .approve(stake.address, ethers.utils.parseEther("100"));
    await megabyte
      .connect(user2)
      .approve(stake.address, ethers.utils.parseEther("100"));
    await megabyte
      .connect(user3)
      .approve(stake.address, ethers.utils.parseEther("100"));
    console.log("Approved 100 tokens to each user");

    return { owner, user1, user2, user3, REWARD_AMOUNT, megabyte, stake };
  }

  it("Should stake tokens", async function () {
    const { owner, user1, user2, user3, stake, megabyte } = await loadFixture(
      fixture
    );

    await stake.connect(user1).stake({ value: ethers.utils.parseEther("80") });
    await stake.connect(user2).stake({ value: ethers.utils.parseEther("20") });
    await stake.connect(user3).stake({ value: ethers.utils.parseEther("100") });
    console.log("Staked 80 tokens to each user");

    expect(
      await stake
        .connect(user1)
        .getStakedDetails()
        .then((val) => {
          return val[0];
        })
    ).to.equal(ethers.utils.parseEther("80"));
    expect(
      await stake
        .connect(user2)
        .getStakedDetails()
        .then((val) => {
          return val[0];
        })
    ).to.equal(ethers.utils.parseEther("20"));
    expect(
      await stake
        .connect(user3)
        .getStakedDetails()
        .then((val) => {
          return val[0];
        })
    ).to.equal(ethers.utils.parseEther("100"));

    console.log(await megabyte.balanceOf(stake.address));
  });

  it("Should unstake tokens", async function () {
    const { owner, user1, user2, user3, stake, megabyte } = await loadFixture(
      fixture
    );
    await stake.connect(user1).stake({ value: ethers.utils.parseEther("80") });
    console.log(await megabyte.balanceOf(stake.address));
    await stake.connect(user1).withdraw();
    expect(
      await stake
        .connect(user1)
        .getStakedDetails()
        .then((val) => {
          return val[0];
        })
    ).to.equal(0);
  });
});
