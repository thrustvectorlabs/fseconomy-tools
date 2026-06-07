const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'tampermonkey-script', 'script.js');
const targetDir = path.join(__dirname, '..', 'dist');
const targetPath = path.join(targetDir, 'fseconomy-tools.user.js');

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(sourcePath, targetPath);

console.log(`Wrote ${path.relative(process.cwd(), targetPath)}`);
