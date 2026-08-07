const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'uploads' && file !== '.well-known') {
        await processDirectory(fullPath);
      }
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const webpPath = path.join(dir, `${name}.webp`);

      // Convert to webp if not already converted or if webp is older
      try {
        const inputStats = fs.statSync(fullPath);
        const inputSizeKB = (inputStats.size / 1024).toFixed(1);

        if (inputStats.size > 100 * 1024) { // Only for images > 100KB
          await sharp(fullPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(webpPath);
          
          const outputStats = fs.statSync(webpPath);
          const outputSizeKB = (outputStats.size / 1024).toFixed(1);
          console.log(`Converted: ${file} (${inputSizeKB} KB) -> ${name}.webp (${outputSizeKB} KB)`);
        }
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }
  }
}

processDirectory(publicDir).then(() => {
  console.log('Finished converting public images to WebP.');
}).catch(console.error);
