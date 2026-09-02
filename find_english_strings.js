const fs = require('fs');
const path = require('path');

const targets = [
  'f:\\FDY\\FDY\\components\\layouts\\navbar.tsx',
  'f:\\FDY\\FDY\\components\\layouts\\footer.tsx',
  'f:\\FDY\\FDY\\components\\hero-puja-slider.tsx',
  'f:\\FDY\\FDY\\components\\sacred-video-gallery.tsx',
  'f:\\FDY\\FDY\\components\\sacred-astro-tools.tsx',
  'f:\\FDY\\FDY\\components\\sacred-trust-testimonials.tsx',
  'f:\\FDY\\FDY\\components\\sacred-faq-accordion.tsx',
  'f:\\FDY\\FDY\\app\\(marketing)\\pujas\\page.tsx',
  'f:\\FDY\\FDY\\app\\(marketing)\\vip-pujas\\page.tsx'
];

targets.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log('--- FILE:', path.basename(file), '---');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Find lines with JSX text or quotes containing English or weird phrasing
      if (line.includes('Book') || line.includes('View') || line.includes('Puja') || line.includes('Exclusive') || line.includes('Welcome') || line.includes('Services') || line.includes('Temple')) {
        if (!line.trim().startsWith('import') && !line.includes('className') && !line.includes('const ') && !line.includes('interface ')) {
          console.log(`L${idx + 1}: ${line.trim()}`);
        }
      }
    });
  }
});
