#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const serviceName = 'Trust File';
const packageName = `${serviceName}.workflow`;
const dest = path.join(os.homedir(), 'Library', 'Services', packageName);

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(path.join(__dirname, '..', packageName), dest, { recursive: true });

console.log(`Installed "${packageName}" to ${dest}`);

// Enable the Quick Action, as the toggle under System Settings >
// Login Items & Extensions > Finder would. The key is quoted because
// `defaults` parses it as a plist string.
const statusKey = `"(null) - ${serviceName} - runWorkflowAsService"`;
const status =
  '<dict><key>presentation_modes</key><dict>' +
  '<key>ContextMenu</key><true/>' +
  '<key>FinderPreview</key><true/>' +
  '<key>ServicesMenu</key><true/>' +
  '<key>TouchBar</key><false/>' +
  '</dict></dict>';

try {
  execFileSync('/usr/bin/defaults', ['write', 'pbs', 'NSServicesStatus', '-dict-add', statusKey, status]);
  execFileSync('/System/Library/CoreServices/pbs', ['-update']);
  console.log(`Enabled "${serviceName}" in the Finder context menu`);
} catch (err) {
  console.warn(
    `Could not enable "${serviceName}" automatically (${err.message.trim()}).\n` +
      'Enable it under System Settings > General > Login Items & Extensions > Finder.'
  );
}
