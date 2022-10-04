import { ethers } from 'hardhat';
import fs from 'fs';

describe('Deploy NFT index.json', () => {
  let deployer: any;
  let generateNft: any;
  let json: any;
  before(async () => {
    json = fs.readFileSync('./assets/assetIndex.json', { encoding: 'utf8' });
    [deployer] = await ethers.getSigners();
    const generateNftFactory = await ethers.getContractFactory('GenerateNft', deployer);

    generateNft = await generateNftFactory
      .connect(deployer)
      .deploy(
        'https://ipfs.io/ipfs/',
        'bafybeievnjzzku5oeo7lwi2txhchjlj5rzek4fo3lcqt7iiogm642luziq',
        json,
        json.length,
      );
  });

  it('Generate NFT based on traits', async () => {
    await generateNft.generateImage();
    const token = await generateNft.getDataUri(1);

    const buff = Buffer.from(token, 'base64');
    let json = JSON.parse(buff.toString('utf8'));

    console.log(json);

    const buffSvg = Buffer.from(json.image, 'base64');
    fs.writeFileSync('./token.svg', buffSvg.toString('utf8'));
  });
});
