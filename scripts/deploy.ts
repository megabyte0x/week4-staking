import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const REWARD_AMOUNT = ethers.utils.parseEther("1000000");

  // const stakeContract = await ethers.getContractFactory("Stake");
  // const stake = await stakeContract.deploy(REWARD_AMOUNT);
  // await stake.deployed();
  // console.log("Stake deployed to:", stake.address);

  // const megabyteContract = await ethers.getContractFactory("Megabyte");
  // const megabyte = await megabyteContract.deploy();
  // await megabyte.deployed();
  // console.log("Megabyte deployed to:", megabyte.address);

  // await stake.setTokenAddress(megabyte.address);
  // console.log("Megabyte address set in Stake contract");

  // console.log("Sleeping.....");
  // await sleep(40000);

  // await hre.run("verify:verify", {
  //   address: megabyte.address,
  // });

  await hre.run("verify:verify", {
    address: "0x12270c1cd08D1EE7f656B437bC43D4C08F58Ee67",
    constructorArguments: [REWARD_AMOUNT],
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
