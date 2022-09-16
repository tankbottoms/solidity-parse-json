import { ethers } from 'hardhat';
import fs from 'fs';

describe('Deploy NFT index.json', () => {
  let deployer: any;
  let generateNft: any;
  let json: any;
  before(async () => {
    json = fs.readFileSync('./assets/index.json', { encoding: 'utf8' });
    [deployer] = await ethers.getSigners();
    const generateNftFactory = await ethers.getContractFactory('GenerateNft', deployer);

    console.log(`\n${deployer.address}\n`);
    console.log(`\nasset/index.json => \n`);
    console.log(json);
    console.log(`\n`);

    generateNft = await generateNftFactory
      .connect(deployer)
      .deploy('https://ipfs.io/ipfs/', '{hash}', json, json.length);
  });

  it('Generate NFT based on traits', async () => {
    let g: any;
    g = await generateNft.generateImage();
    console.dir(g);
    console.log(`\n`);

    const a = await generateNft.getNames();
    console.log(a);
    console.log(`\n`);

    false && console.dir(g, { depth: 2 });
  });
});

// Parse token 0x7b226b6579223a205b226b657931222c226b657932222c226b657933222c226b657934225d2c20226b657931223a207b226368696c644b6579223a202276616c7565227d2c20226b657932223a20312c20226b657933223a2022737472696e67227d

// { -> 0x7b
// } -> 0x7d
// " -> 0x22
// : -> 0x3a
// [ -> 0x5b
// , -> 0x2c
// ] -> 0x5d
