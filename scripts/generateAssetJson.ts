import { generateAssetIndex, listAssets } from '../test/utils/AssetUtils';
import fs from 'fs';

async function main() {
  const assets = listAssets('./assets/original', '.svg');
  fs.writeFileSync('./assets/assetIndex.json', JSON.stringify(assets, null, 2));

  const indexJson = JSON.stringify(generateAssetIndex('./assets'));
  fs.writeFileSync('./assets/index.json', indexJson);

  console.log(`list all assets:` + `\n`);
  console.log(assets);
  console.log(`\n`);

  console.log(`gen asset index:` + `\n`);
  console.log(indexJson);
  console.log(`\n`);
}

main().then(() => {
  false && console.log('Success!');  
});
