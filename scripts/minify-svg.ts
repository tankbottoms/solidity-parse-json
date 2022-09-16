import fs from 'fs';
import { resolve } from 'path';

const originalDir = fs.readdirSync(resolve(__dirname, '../assets/original'));

for (const childDir of originalDir) {
  const childPath = resolve(__dirname, '../assets/original', childDir);
  const childDirectories = fs.readdirSync(childPath);

  for (const file of childDirectories) {
    if (file) {
      const fileContent = fs
        .readFileSync(resolve(__dirname, `../assets/original/${childDir}/${file}`), 'utf8')
        .replace(/[\s\n]+/g, ' ')
        .replace(/[:]\s+/g, ':')
        .replace(/[;]\s+/g, ';')
        .replace(/[>]\s+[<]/g, '><')
        .replace(/\s+\/[>]/g, '/>')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/[,]\s+/g, ',')
        .replace(/[<]style[>]\s+/g, '<style>');

      if (!fs.existsSync(resolve(__dirname, `../assets/minified/${childDir}`))) {
        fs.mkdirSync(resolve(__dirname, `../assets/minified/${childDir}`));
      }

      fs.writeFileSync(resolve(__dirname, `../assets/minified/${childDir}/${file}`), fileContent);

      const { size: originalSize } = fs.statSync(
        resolve(__dirname, `../assets/original/${childDir}/${file}`),
      );
      const { size: minifiedSize } = fs.statSync(
        resolve(__dirname, `../assets/minified/${childDir}/${file}`),
      );

      console.log(`Minified file ${file}\n Changed size ${originalSize} to ${minifiedSize}\n`);
    }
  }
}

export default '';
