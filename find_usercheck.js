const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full);
    } else if (stat.isFile() && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('UserCheck')) {
        console.log('🔥 FOUND UserCheck IN:', full);
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('UserCheck')) {
            console.log(`  L${i + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir('f:\\FDY\\FDY\\app');
searchDir('f:\\FDY\\FDY\\components');
