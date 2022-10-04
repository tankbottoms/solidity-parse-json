const { readFileSync } = require('fs');

const json = readFileSync('./assets/index.json', { encoding: 'utf8' });

module.exports = [
  'https://ipfs.io/ipfs/',
  'bafybeievnjzzku5oeo7lwi2txhchjlj5rzek4fo3lcqt7iiogm642luziq',
  json,
  json.length,
];
