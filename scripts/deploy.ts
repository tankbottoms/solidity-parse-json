import { readFileSync } from 'fs';
import { ethers } from 'hardhat';

async function main() {
  const json = readFileSync('./assets/index.json', { encoding: 'utf8' });

  const generateNftFactory = await ethers.getContractFactory('GenerateNft');

  const generateNft = await generateNftFactory.deploy(
    'https://ipfs.io/ipfs/',
    'bafybeievnjzzku5oeo7lwi2txhchjlj5rzek4fo3lcqt7iiogm642luziq',
    json,
    json.length,
  );

  await generateNft.deployed();

  console.log(`Deployed to ${generateNft.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
