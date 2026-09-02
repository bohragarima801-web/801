const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full);
    } else if (stat.isFile() && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js'))) {
      if (f.includes('checkout') || f.includes('cart') || f.includes('order')) {
        console.log('🔥 FOUND:', full);
      }
    }
  }
}

searchDir('f:\\FDY\\FDY\\app');
searchDir('f:\\FDY\\FDY\\components');
searchDir('f:\\FDY\\FDY\\lib');
