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

Abstract: An example to create a 3mf Cube

Interface version: 2.3.2
+++
*/

const lib3mf = require('../lib3mf');

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

// Helper function to create a vertex on the mesh object and return its index
function createVertex(mesh, x, y, z) {
    const position = {
        Coordinates: [x, y, z],
    };
    
    // Add vertex to the mesh
    const vertexIndex = mesh.AddVertex(position);

    return position
}

// Helper function to add a triangle to the mesh object using three vertex indices
function addTriangle(mesh, p1, p2, p3) {
    const triangle = {
        Indices: [p1, p2, p3],
    };
    
    // Add triangle to the mesh
    mesh.AddTriangle(triangle);

    return triangle
}

function main() {
    try {
        // Create a new 3MF model
        const model = lib3mf.CreateModel();

        // Initialize a mesh object and set its name
        const meshObject = model.AddMeshObject();
        // console.log(meshObject)
        // meshObject.SetName("BOX")
        console.log(getAllMethods(meshObject))
        console.log(meshObject)

        // Define the size of the cube
        const fSizeX = 100.0, fSizeY = 200.0, fSizeZ = 300.0;

        // Create vertices
        const vertices = [
            createVertex(meshObject, 0, 0, 0),
            createVertex(meshObject, fSizeX, 0, 0),
            createVertex(meshObject, fSizeX, fSizeY, 0),
            createVertex(meshObject, 0, fSizeY, 0),
            createVertex(meshObject, 0, 0, fSizeZ),
            createVertex(meshObject, fSizeX, 0, fSizeZ),
            createVertex(meshObject, fSizeX, fSizeY, fSizeZ),
            createVertex(meshObject, 0, fSizeY, fSizeZ),
        ];

        // Define triangles by vertices indices
        const triangleIndices = [
            [2, 1, 0], [0, 3, 2], [4, 5, 6], [6, 7, 4],
            [0, 1, 5], [5, 4, 0], [2, 3, 7], [7, 6, 2],
            [1, 2, 6], [6, 5, 1], [3, 0, 4], [4, 7, 3],
        ];

        // Initialize an empty array for triangles
        const triangles = [];

        // Use a simple for loop to add triangles and push them into the triangles array
        for (let i = 0; i < triangleIndices.length; i++) {
            const indices = triangleIndices[i];
            const triangle = addTriangle(meshObject, indices[0], indices[1], indices[2]);
            triangles.push(triangle);
        }

        console.log(triangles)

        // Set geometry to the mesh object
        meshObject.SetGeometry(vertices, triangles);

        
        // Get identity transform
        const transform = lib3mf.GetIdentityTransform();

        // Add build item with an identity transform
        model.AddBuildItem(meshObject, transform);

        // Save the model to a 3MF file
        const writer = model.QueryWriter('3mf');
        writer.WriteToFile("cube.3mf");

        console.log("3MF file with a cube written successfully to 'cube.3mf'");
    } catch (error) {
        console.error("An error occurred:", error.message);
        process.exit(1);
    }
}

main();
