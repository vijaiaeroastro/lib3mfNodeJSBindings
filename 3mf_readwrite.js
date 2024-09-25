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

Abstract: An example to convert between 3MF and STL

Interface version: 2.3.2
+++
*/

const path = require('path');
const lib3mf = require('./lib3mf');
const fs = require('fs');

// Function to get the file extension
function getFileExtension(fileName) {
    return path.extname(fileName).toLowerCase();
}

// Function to get the base file name without the extension
function getBaseFileName(fileName) {
    return path.basename(fileName, path.extname(fileName));
}

// Function to perform the conversion between 3MF and STL
function convertFile(inputFilePath) {
    const ext = getFileExtension(inputFilePath);
    const baseFileName = getBaseFileName(inputFilePath);

    let model = lib3mf.CreateModel();
    let reader, writer;
    
    if (ext === '.3mf') {
        console.log("3MF file detected, converting to STL");

        // Create a 3MF reader
        reader = model.QueryReader('3mf');
        reader.ReadFromFile(inputFilePath);

        // Create an STL writer
        writer = model.QueryWriter('stl');
        const outputFilePath = `${baseFileName}.stl`;
        writer.WriteToFile(outputFilePath);

        console.log(`File converted to ${outputFilePath}`);

    } else if (ext === '.stl') {
        console.log("STL file detected, converting to 3MF");

        // Create an STL reader
        reader = model.QueryReader('stl');
        reader.ReadFromFile(inputFilePath);

        // Create a 3MF writer
        writer = model.QueryWriter('3mf');
        const outputFilePath = `${baseFileName}.3mf`;
        writer.WriteToFile(outputFilePath);

        console.log(`File converted to ${outputFilePath}`);

    } else {
        console.error("Unsupported file extension. Please provide a .3mf or .stl file.");
        return;
    }
}

// Get the arguments passed from the command line
const args = process.argv.slice(2); // Skips first two elements: node and script name

// Ensure an argument (input file path) is provided
if (args.length === 0) {
    console.error('Please provide a file to convert.');
    console.error('Usage: node 3mf_readwrite.js <filename>');
    process.exit(1);
}

const inputFilePath = args[0];

// Check if file exists
if (!fs.existsSync(inputFilePath)) {
    console.error(`File not found: ${inputFilePath}`);
    process.exit(1);
}

// Perform the conversion
convertFile(inputFilePath);
