const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const userscriptPath = path.join(__dirname, '..', 'tampermonkey-script', 'script.js');
const repositoryOwner = 'thrustvectorlabs';
const repositoryName = 'fseconomy-tools';
const latestReleaseBaseUrl = `https://github.com/${repositoryOwner}/${repositoryName}/releases/latest/download`;

const userscriptMetadata = {
  version: null,
  downloadURL: `${latestReleaseBaseUrl}/fseconomy-tools.user.js`,
  updateURL: `${latestReleaseBaseUrl}/fseconomy-tools.user.js`,
  require: `${latestReleaseBaseUrl}/bundle.js`,
};

const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentUserscript = fs.readFileSync(userscriptPath, 'utf8');
userscriptMetadata.version = version;

const replaceMetadataField = (source, field, value) => {
  const pattern = new RegExp(`(^// @${field}\\s+).+$`, 'm');
  if (pattern.test(source)) {
    return source.replace(pattern, `$1${value}`);
  }

  return source.replace('// ==/UserScript==', `// @${field}      ${value}\n// ==/UserScript==`);
};

let nextUserscript = currentUserscript;

for (const [field, value] of Object.entries(userscriptMetadata)) {
  nextUserscript = replaceMetadataField(nextUserscript, field, value);
}

if (nextUserscript !== currentUserscript) {
  fs.writeFileSync(userscriptPath, nextUserscript);
}
