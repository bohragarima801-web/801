const fs = require('fs');
const path = require('path');

const fileList = [
  'app/(marketing)/page.tsx',
  'app/(marketing)/about/page.tsx',
  'app/(marketing)/book-chadhawa/page.tsx',
  'app/(marketing)/bhaktiseva/page.tsx',
  'components/sacred-trust-testimonials.tsx',
  'components/layouts/footer.tsx',
  'components/layouts/navbar.tsx',
  'components/puja-client-view.tsx',
  'components/vip-puja-single-view.tsx',
  'app/bookings/new/page.tsx',
  'app/checkout/page.tsx',
];

const colorReplacements = [
  // 1. Backgrounds & Surfacing
  { from: /#FFF9EF/g, to: '#FAF8F5' },
  { from: /#F7EBD7/g, to: '#FFF3E8' },
  
  // 2. Primary Saffron / Kesariya Accents
  { from: /#E58A16/g, to: '#FF6600' },
  { from: /#d4790e/g, to: '#E65C00' },

  // 3. Royal Maroon / Wine
  { from: /#6B2635/g, to: '#7A1521' },
  { from: /#521c28/g, to: '#580E17' },

  // 4. Radiant Gold
  { from: /#C99A3D/g, to: '#D4AF37' },

  // 5. Borders & Dividers
  { from: /#E6D6BE/g, to: '#EFE4D6' },

  // 6. Text Colors
  { from: /#292321/g, to: '#1C1614' },
  { from: /#4A403C/g, to: '#4A3E39' },
  { from: /#665E58/g, to: '#6B5E57' },
];

for (const relPath of fileList) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log('Skipping (not found):', relPath);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;
  for (const { from, to } of colorReplacements) {
    content = content.replace(from, to);
  }
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated design colors in:', relPath);
  } else {
    console.log('No change needed for:', relPath);
  }
}

console.log('Done upgrading color palette across all key pages!');
