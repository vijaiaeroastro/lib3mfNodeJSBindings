const path = require('path');
const os = require('os');

// Determine the platform and library extension
const platform = os.platform();
let lib3mfPath;

if (platform === 'win32') {
    // Windows uses .dll files
    lib3mfPath = path.join(__dirname, 'libraries', 'lib3mf.dll');
} else if (platform === 'darwin') {
    // macOS uses .dylib files
    lib3mfPath = path.join(__dirname, 'libraries', 'lib3mf.dylib');
} else {
    // Linux uses .so files
    lib3mfPath = path.join(__dirname, 'libraries', 'lib3mf.so');
}

// Load the Node.js addon and the library path
const wrapper = require(path.join(__dirname, 'build/Release/3mf_nodeaddon.node'))(lib3mfPath);
module.exports = wrapper