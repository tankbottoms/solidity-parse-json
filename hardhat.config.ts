import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import 'solidity-coverage';
import 'solidity-docgen';

dotenv.config();
const defaultNetwork = 'localhost';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 400,
      },
    },
  },
  defaultNetwork,
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 31337,
      blockGasLimit: 1_000_000_000,
    },
    localhost: {
      url: 'http://localhost:8545',
      timeout: 1_000_000_000,
    },
    rinkeby: {
      url: `${process.env.INFURA_GATEWAY_RINKEBY}/${process.env.INFURA_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    goerli: {
      url: `${process.env.ALCHEMY_GATEWAY_GOERLI}/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: false,
    only: [],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    gasPrice: 30,
    showTimeSpent: true,
    coinmarketcap: `${process.env.COINMARKETCAP_KEY}`,
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`,
  },
  mocha: {
    timeout: 30 * 60 * 1000,
  },
  docgen: {},
};

export default config;
