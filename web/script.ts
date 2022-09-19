import path from 'path';

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
