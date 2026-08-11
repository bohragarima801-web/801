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
    } else if (/\.(jpg|jpeg|png|bmp|tiff)$/i.test(file)) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const webpPath = path.join(dir, `${name}.webp`);

      try {
        const inputStats = fs.statSync(fullPath);
        const inputSizeKB = (inputStats.size / 1024).toFixed(1);

        let maxDim = 1200;
        let quality = 80;
        let buffer;

        for (let pass = 0; pass < 5; pass++) {
          buffer = await sharp(fullPath)
            .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
            .webp({ quality, effort: 6 })
            .toBuffer();

          if (buffer.length <= 98 * 1024) break;
          quality = Math.max(40, quality - 12);
          maxDim = Math.max(600, Math.round(maxDim * 0.85));
        }

        fs.writeFileSync(webpPath, buffer);
        const outputSizeKB = (buffer.length / 1024).toFixed(1);
        console.log(`Converted: ${file} (${inputSizeKB} KB) -> ${name}.webp (${outputSizeKB} KB)`);
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
      }
    }
  }
}

processDirectory(publicDir).then(() => {
  console.log('Finished converting public images to WebP.');
}).catch(console.error);
