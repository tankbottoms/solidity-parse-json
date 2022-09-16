const t =
  '0x7b226b6579223a205b226b657931222c226b657932222c226b657933222c226b657934225d2c20226b657931223a207b226368696c644b6579223a202276616c7565227d2c20226b657932223a20312c20226b657933223a2022737472696e67227d';

function main() {
  const struct = [];

  for (let i = 0; i < t.length; i += 2) {
    const c = t.slice(i, i + 2);
    if (c === '0x') continue;
    if (c === '7b') {
      for (let j = i + 2; j < t.length; j += 2) {
        const a = t.slice(j, j + 2);
        if (a === '22') {
          // struct.push({ start:  });
          console.log(`j = ${j}, i = ${i}`);
        }
      }
    }
  }
}

main();

console.log('T', t.slice(4, 12));
