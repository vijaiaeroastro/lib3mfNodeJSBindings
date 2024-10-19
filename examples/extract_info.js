/*
+++

Copyright (C) 2024 3MF Consortium (Vijai Kumar Suriyababu)

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions, and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions, and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Abstract: Extract info from a 3mf file

Interface version: 2.3.2
+++
*/

const lib3mf = require('../lib3mf');
const fs = require('fs');

// Helper function to get all methods of an object
function getAllMethods(obj) {
    let props = [];
    let currentObj = obj;

    do {
        props = props.concat(Object.getOwnPropertyNames(currentObj));
    } while (currentObj = Object.getPrototypeOf(currentObj));

    return props.sort().filter((e, i, arr) => typeof obj[e] === 'function' && e !== arr[i + 1]);
}

// Helper function to read a 3MF file into the model
function read3MFFileToModel(model, filePath) {
    const reader = model.QueryReader('3mf');
    reader.SetStrictModeActive(false);
    reader.ReadFromFile(filePath);
}

// Function to get and print the lib3mf library version information
function getVersion() {
    const versionInfo = lib3mf.GetLibraryVersion();
    const nMajor = versionInfo.Major;
    const nMinor = versionInfo.Minor;
    const nMicro = versionInfo.Micro;
    let versionString = `lib3mf version: ${nMajor}.${nMinor}.${nMicro}`;

    const preReleaseInfo = lib3mf.GetPrereleaseInformation();
    if (preReleaseInfo.hasInfo) {
        versionString += `-${preReleaseInfo.prereleaseInfo}`;
    }

    const buildInfo = lib3mf.GetBuildInformation();
    if (buildInfo.hasInfo) {
        versionString += `+${buildInfo.buildInfo}`;
    }

    console.log(versionString);
}

// Function to print metadata information from the model
function showMetadataInformation(metadataGroup) {
    const count = metadataGroup.GetMetaDataCount();
    for (let i = 0; i < count; i++) {
        const metadata = metadataGroup.GetMetaData(i);
        const name = metadata.GetName();
        const value = metadata.GetValue();
        console.log(`Metadata: ${name} = ${value}`);
    }
}

// Function to print slice stack information from the model
function showSliceStackInformation(model) {
    const sliceStacks = model.GetSliceStacks();
    while (sliceStacks.MoveNext()) {
        const sliceStack = sliceStacks.GetCurrentSliceStack();
        const resourceID = sliceStack.GetResourceID();
        console.log(`Slice Stack: ${resourceID}`);
    }
}

// Function to print object information from the model
function showObjectInformation(model) {
    const objectIterator = model.GetObjects();
    while (objectIterator.MoveNext()) {
        const obj = objectIterator.GetCurrentObject();
        const resourceID = obj.GetResourceID();
        const isMesh = obj.IsMeshObject();
        const isComponent = obj.IsComponentsObject();

        if (isMesh) {
            console.log(`Mesh Object: ${resourceID}`);
        } else if (isComponent) {
            console.log(`Components Object: ${resourceID}`);
        } else {
            console.log(`Unknown Object: ${resourceID}`);
        }
    }
}

// Main function to extract info from a 3MF file
function extractInfo(filePath) {
    // Create a new 3MF model
    const model = lib3mf.CreateModel();

    // Read the 3MF file into the model
    read3MFFileToModel(model, filePath);

    // Print library version
    getVersion(lib3mf);

    // Show metadata information
    const metaDataGroup = model.GetMetaDataGroup();
    showMetadataInformation(metaDataGroup);

    // Show slice stack information
    showSliceStackInformation(model);

    // Show object information
    showObjectInformation(model);
}

// Main entry point
function main() {
    if (process.argv.length !== 3) {
        console.log('Usage: node extract_info.js model.3mf');
        process.exit(1);
    }
    extractInfo(process.argv[2]);
}

main();
