const fs = require('fs');
const path = require('path');

function searchApp(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchApp(full);
    } else {
      console.log('APP FILE:', full.replace('f:\\FDY\\FDY\\', ''));
    }
  }
}

searchApp('f:\\FDY\\FDY\\app');
