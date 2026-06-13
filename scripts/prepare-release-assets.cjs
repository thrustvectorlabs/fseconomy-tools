const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'tampermonkey-script', 'script.js');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const targetDir = path.join(__dirname, '..', 'dist');
const targetPath = path.join(targetDir, 'fseconomy-tools.user.js');
const repositoryOwner = 'thrustvectorlabs';
const repositoryName = 'fseconomy-tools';

const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const releaseTag = `v${version}`;
const releaseBundleUrl = `https://github.com/${repositoryOwner}/${repositoryName}/releases/download/${releaseTag}/bundle.js`;
const userscriptSource = fs.readFileSync(sourcePath, 'utf8');
const releaseUserscript = userscriptSource.replace(
  /^\/\/ @require\s+.+$/m,
  `// @require      ${releaseBundleUrl}`
);

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, releaseUserscript);

console.log(`Wrote ${path.relative(process.cwd(), targetPath)}`);
