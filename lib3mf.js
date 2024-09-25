// lib3mf.js
const path = require('path');


function getAllMethods(obj) {
    let props = [];
    let currentObj = obj;

    do {
        // Get all properties (including non-enumerable ones) from the current object
        props = props.concat(Object.getOwnPropertyNames(currentObj));
    } while (currentObj = Object.getPrototypeOf(currentObj));  // Go up the prototype chain

    // Filter out non-function properties and remove duplicates
    return props.sort().filter((e, i, arr) => typeof obj[e] === 'function' && e !== arr[i + 1]);
}

// Load the lib3mf Node.js addon
const wrapper = require(path.join(__dirname, 'build/Release/3mf_nodeaddon.node'))(path.join(__dirname, 'lib3mf.so'));
getAllMethods(wrapper)

// Export the wrapper so it can be imported
module.exports = wrapper;
