const fs = require('fs');
const path = require('path');

console.log('🔍 Running Client Component Patcher...');

const dirsToCheck = [
  path.join(process.cwd(), 'components', 'ui'),
  path.join(process.cwd(), 'components')
];

let fixedFiles = 0;

function checkAndPatchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkAndPatchDir(fullPath); // Recursive
      continue;
    }

    if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // If it already has use client, skip
      if (content.includes('"use client"') || content.includes("'use client'") || content.includes('`use client`')) {
        continue;
      }

      // Check for client-side indicators
      const needsClient = 
        content.includes('@radix-ui') || 
        content.includes('framer-motion') || 
        content.includes('forwardRef') || 
        content.includes('useState') ||
        content.includes('useEffect') ||
        content.includes('useContext') ||
        content.includes('useRef') ||
        content.includes('usePathname') ||
        content.includes('useRouter');

      if (needsClient) {
        console.log(`⚠️ Missing 'use client' in ${file}. Patching...`);
        const newContent = `"use client";\n\n` + content;
        fs.writeFileSync(fullPath, newContent, 'utf8');
        fixedFiles++;
      }
    }
  }
}

dirsToCheck.forEach(checkAndPatchDir);

console.log(`✅ Client Component Patcher finished. Fixed ${fixedFiles} files.`);
