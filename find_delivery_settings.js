const fs = require('fs');
const path = require('path');

function searchSettings() {
  const file = 'f:\\FDY\\FDY\\app\\admin\\settings\\page.tsx';
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log('--- FILE:', file, '---');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('delivery') || line.includes('Delivery') || line.includes('shipping') || line.includes('Shipping')) {
        console.log(`L${i + 1}: ${line.trim()}`);
      }
    });
  }
}

searchSettings();
