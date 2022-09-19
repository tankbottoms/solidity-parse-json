import { config } from 'dotenv';
import { uploadFleek } from './utiils/fleek';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';

import { NFTStorage } from 'nft.storage';
import { filesFromPath } from 'files-from-path';
import path from 'path';

config();

const USE_IPFS_PROVIDER = process.env.USE_IPFS_PROVIDER || 'fleek';

//Remane And copy files

function renameAndCopy() {
  if (!existsSync('./assets/renamed')) {
    mkdirSync('./assets/renamed');
  }
  const minifiedDirectory = readdirSync(`./assets/minified`);
  for (const childDir of minifiedDirectory) {
    const minifiedChildDirectories = readdirSync(`./assets/minified/${childDir}`);
    for (const [i, file] of minifiedChildDirectories.entries()) {
      const dataFile = readFileSync(`./assets/minified/${childDir}/${file}`);
      if (!existsSync(`./assets/renamed/${childDir}`)) {
        mkdirSync(`./assets/renamed/${childDir}`);
      }
      writeFileSync(`./assets/renamed/${childDir}/${i}`, dataFile);
    }
  }
}

function createListFiles(bucketName: string) {
  const originalFiles: { [key: string]: any } = {};
  const [, , minified, original] = readdirSync('./assets');

  const minifiedDirectory = readdirSync(`./assets/${minified}`);
  const originalDirectory = readdirSync(`./assets/${original}`);

  for (const childDir of originalDirectory) {
    const originalChildFiles = readdirSync(`./assets/${original}/${childDir}`);
    originalFiles[childDir] = [];
    for (const [i, originalChildFile] of originalChildFiles.entries()) {
      const path = `${bucketName}/assets/original/${childDir}`;
      const dataFile = readFileSync(`./assets/${original}/${childDir}/${originalChildFile}`);
      originalFiles[childDir].push({
        path,
        data: dataFile,
        key: i.toString(),
      });
    }
  }
  return originalFiles;
}

if (USE_IPFS_PROVIDER === 'fleek') {
  const FLEEK_API_KEY = process.env.FLEEK_API_KEY;
  const FLEEK_API_SECRET = process.env.FLEEK_API_SECRET;
  const FLEEK_BUCKET_NAME = process.env.FLEEK_BUCKET_NAME;

  if (!FLEEK_API_KEY || !FLEEK_API_SECRET || !FLEEK_BUCKET_NAME) {
    throw new Error('FLEEK_API_KEY or FLEEK_API_SECRET or FLEEK_BUCKET_NAME is required');
  }
  const fileList = createListFiles(FLEEK_BUCKET_NAME);
  uploadFleek(FLEEK_API_KEY, FLEEK_API_SECRET, fileList);
} else if (USE_IPFS_PROVIDER === 'nft-storage') {
  const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

  if (!NFT_STORAGE_KEY) {
    throw new Error('NFT_STORAGE_KEY is required');
  }
  renameAndCopy();

  const files = filesFromPath(`./assets/renamed`, {
    pathPrefix: path.resolve(`./assets/renamed`),
    hidden: true, // use the default of false if you want to ignore files that start with '.'
  });

  const storage = new NFTStorage({ token: NFT_STORAGE_KEY });

  const main = async () => {
    console.log(`storing file(s) from ${path}`);
    const cid = await storage.storeDirectory(files);
    console.log({ cid });

    const status = await storage.status(cid);
    console.log(status);
  };
  main();
  //console.dir(, { depth: 6 });
}
