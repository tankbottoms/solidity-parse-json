import fs from 'fs';
import * as path from 'path';
import { BigNumber } from 'ethers';

/**
 * Lists png files in a given location recursively.
 *
 * @param location
 * @param extension Defaults to '.png', frequently also '.svg'
 */
export function listAssets(location: string, extension = '.png'): { [key: string]: string } {
  const contents = fs.readdirSync(location);
  const traits: any = {};
  for (const c of contents) {
    if (fs.lstatSync(path.join(location, c)).isDirectory()) {
      traits[c] = [];
      const ccontents = fs.readdirSync(path.join(location, c));
      for (const cc of ccontents) {
        if (fs.lstatSync(path.join(location, c, cc)).isFile() && path.parse(cc).ext === extension) {
          traits[c].push(`${path.parse(cc).name}${path.parse(cc).ext}`);
        }
      }
    }
  }
  return traits;
}

export function generateAssetIndex(source: string) {
  const layers = JSON.parse(fs.readFileSync(path.join(source, 'assetIndex.json')).toString());
  const layerNames = Object.keys(layers);

  const details: any = {};
  let offset = 0;
  for (let i = 0; i < layerNames.length; i++) {
    const group = layerNames[i];
    const layerOptions = layers[group];

    const width = Math.ceil(Math.log2(layerOptions.length));
    details[group] = [layerOptions.length, offset];

    let mask = 1;
    if (width == 0) {
      offset += 1;
    } else if (width <= 4) {
      offset += 4;
      mask = 2 ** 4 - 1;
    } else if (width <= 6) {
      offset += 6;
      mask = 2 ** 6 - 1;
    } else if (width <= 8) {
      offset += 8;
      mask = 2 ** 8 - 1;
    } else if (width <= 12) {
      offset += 12;
      mask = 2 ** 12 - 1;
    } else if (width <= 16) {
      offset += 16;
      mask = 2 ** 16 - 1;
    }

    details[group].push(mask);
  }

  return details;
}

export function renameAssets(source: string, destination: string) {
  const layers = JSON.parse(fs.readFileSync(path.join(source, 'assetIndex.json')).toString());

  const layerNames = Object.keys(layers);

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  let offset = 0;
  for (let i = 0; i < layerNames.length; i++) {
    const group = layerNames[i];
    const layerOptions = layers[group];

    for (let j = 0; j < layerOptions.length; j++) {
      const item = layerOptions[j];
      const filenameIndex = j + 1; // NOTE: without this all 0-index file will collide
      const fileName = BigNumber.from(filenameIndex).shl(offset).toString();

      const imageSource = path.resolve(source, group, `${item}`);
      const imageDestination = path.resolve(destination, `${fileName}`);
      fs.copyFileSync(imageSource, imageDestination, fs.constants.COPYFILE_EXCL);
      console.log(`${group}/${item}->${fileName} (${filenameIndex}, ${offset})`);
    }
  }
}
