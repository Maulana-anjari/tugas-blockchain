require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const { API_URL, PRIVATE_KEY } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    georli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  paths: {
    artifacts: '../dashboard/src/artifacts',
  },
};
