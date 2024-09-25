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

Abstract: Simplest 3mf example that just includes a single triangle

Interface version: 2.3.2
+++
*/

const lib3mf = require('./lib3mf');

// Helper function to create a vertex on the mesh object and return its index
function createVertexAndReturnIndex(mesh, x, y, z) {
    const position = {
        Coordinates: [x, y, z],
    };
    
    // Add vertex to the mesh
    const vertexIndex = mesh.AddVertex(position);

    // Check if vertexIndex is undefined or null (not using falsy, because 0 is valid)
    if (vertexIndex === undefined || vertexIndex === null) {
        throw new Error(`Failed to add vertex at (${x}, ${y}, ${z})`);
    } else {
        return vertexIndex
    }
}

// Helper function to add a triangle to the mesh object using three vertex indices
function addTriangle(mesh, p1, p2, p3) {
    const triangle = {
        Indices: [p1, p2, p3],
    };
    
    // Add triangle to the mesh
    mesh.AddTriangle(triangle);
}

function main() {
    try {
        // Create a new 3MF model
        const model = lib3mf.CreateModel();

        // Initialize a mesh object
        const meshObject = model.AddMeshObject();

        // Create 3 vertices
        const p1 = createVertexAndReturnIndex(meshObject, 0, 0, 0);
        const p2 = createVertexAndReturnIndex(meshObject, 0.5, 0, 0);
        const p3 = createVertexAndReturnIndex(meshObject, 0.5, 0.5, 1);

        // Create a triangle with 3 positions
        addTriangle(meshObject, p1, p2, p3);

        // Get a 3MF writer and write the single triangle
        const writer = model.QueryWriter('3mf');
        writer.WriteToFile('triangle.3mf');

        console.log("3MF file with a single triangle written successfully to 'triangle.3mf'");
    } catch (error) {
        console.error("An error occurred:", error.message);
        process.exit(1); // Exit the program if an error occurs
    }
}

main();