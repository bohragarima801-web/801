const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      processDir(full);
    } else if (stat.isFile() && (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.json') || f.endsWith('.html') || f.endsWith('.md'))) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.toLowerCase().includes('devpunya')) {
        console.log('🔥 FOUND Devpunya IN:', full);
        content = content.replace(/Devpunya/g, 'DivyaYagyam')
                         .replace(/devpunya/g, 'divyayagyam')
                         .replace(/DevPunya/g, 'DivyaYagyam')
                         .replace(/DEVPUNYA/g, 'DIVYAYAGYAM');
        fs.writeFileSync(full, content, 'utf8');
        console.log('✅ REPLACED WITH DivyaYagyam IN:', full);
      }
    }
  }
}

processDir('f:\\FDY\\FDY\\app');
processDir('f:\\FDY\\FDY\\components');
processDir('f:\\FDY\\FDY\\lib');
