import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: ".env" });

const ALCHEMY_HTTP_URL: string = process.env.ALCHEMY_HTTP_URL as string;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY as string;
const POLYGON_SCAN_KEY: string = process.env.POLYGON_SCAN_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // mumbai: {
    //   url: ALCHEMY_HTTP_URL as string,
    //   accounts: [PRIVATE_KEY || ""],
    // },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGON_SCAN_KEY,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
