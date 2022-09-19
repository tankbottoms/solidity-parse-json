import fleekStorage from '@fleekhq/fleek-storage-js';
import { writeFileSync } from 'fs';

type ListFiles = {
  [key: string]: {
    path: string;
    data: any;
    key: string;
  }[];
};

export async function uploadFleek(apiKey: string, apiSecret: string, listFiles: ListFiles) {
  const keys = Object.keys(listFiles);
  const newAssets: any = {};

  for (const name of keys) {
    newAssets[name] = [];
    for (const file of listFiles[name]) {
      const uploadedFile = await fleekStorage.upload({
        apiKey,
        apiSecret,
        key: file.key,
        bucket: file.path,
        data: file.data,
        httpUploadProgressCallback: (event) => {
          console.log(Math.round((event.loaded / event.total) * 100) + '% done');
        },
      });
      const { hash } = uploadedFile;
      newAssets[name].push(hash);
    }
  }
  writeFileSync('./assets/newAssetIndex.json', JSON.stringify(newAssets, null, 2));
}
