const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const userscriptPath = path.join(__dirname, '..', 'tampermonkey-script', 'script.js');

const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentUserscript = fs.readFileSync(userscriptPath, 'utf8');

const nextUserscript = currentUserscript.replace(/(^\/\/ @version\s+).+$/m, `$1${version}`);

if (nextUserscript !== currentUserscript) {
  fs.writeFileSync(userscriptPath, nextUserscript);
}
