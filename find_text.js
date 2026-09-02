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
      if (content.includes('वरिष्ठ पीताम्बरा वेदाचार्यों') || content.includes('१,२५,००० जाप') || content.includes('1,25,000 जाप')) {
        console.log('🔥 FOUND IN:', full);
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('वरिष्ठ') || line.includes('जाप')) {
            console.log(`  L${i + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir('f:\\FDY\\FDY');
