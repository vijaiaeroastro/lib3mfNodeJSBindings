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

Abstract: Beam lattice example

Interface version: 2.3.2
+++
*/

const lib3mf = require('./lib3mf');
const fs = require('fs');

// Helper function to create a vertex on the mesh object and return it
function createVertex(mesh, x, y, z) {
    const position = {
        Coordinates: [x, y, z],
    };
    try {
        mesh.AddVertex(position);
    } catch (err) {
        console.error(`Error adding vertex at (${x}, ${y}, ${z}): ${err.message}`);
        process.exit(1);
    }
    return position;
}

// Helper function to convert a string to a lib3mf.BeamLatticeCapMode enum
function convertBeamStringToEnum(beamMode) {
    switch (beamMode) {
        case "Butt":
            return 2;
        case "Sphere":
            return 0;
        case "HemiSphere":
            return 1;
        default:
            console.error(`Invalid beam cap mode: ${beamMode}`);
            process.exit(1);
            return 2; // Default value
    }
}

// Helper function to create a beam
function createBeam(v0, v1, r0, r1, c0, c1) {
    const beam = {
        Indices: [v0, v1],
        Radii: [r0, r1],
        CapModes: [c0, c1],
    };
    return beam;
}

function main() {
    // Check the lib3mf version
    const versionInfo = lib3mf.GetLibraryVersion();
    const nMajor = versionInfo.Major;
    const nMinor = versionInfo.Minor;
    const nMicro = versionInfo.Micro;
    console.log(`lib3mf version: ${nMajor}.${nMinor}.${nMicro}`);

    // Create a new 3MF model
    const model = lib3mf.CreateModel();

    // Initialize a mesh object and set its name
    const meshObject = model.AddMeshObject();
    meshObject.SetName("Beamlattice");

    // Define the size of the box
    const fSizeX = 100.0, fSizeY = 200.0, fSizeZ = 300.0;

    // Create vertices
    const vertices = [
        createVertex(meshObject, 0.0, 0.0, 0.0),
        createVertex(meshObject, fSizeX, 0.0, 0.0),
        createVertex(meshObject, fSizeX, fSizeY, 0.0),
        createVertex(meshObject, 0.0, fSizeY, 0.0),
        createVertex(meshObject, 0.0, 0.0, fSizeZ),
        createVertex(meshObject, fSizeX, 0.0, fSizeZ),
        createVertex(meshObject, fSizeX, fSizeY, fSizeZ),
        createVertex(meshObject, 0.0, fSizeY, fSizeZ),
    ];

    // Define beam variables
    const r0 = 1.0, r1 = 1.5, r2 = 2.0, r3 = 2.5;

    beamButtEnum = convertBeamStringToEnum("Butt");
    beamSphereEnum = convertBeamStringToEnum("Sphere");
    beamHemiSphereEnum = convertBeamStringToEnum("HemiSphere");

    // Create beams
    const beams = [
        createBeam(2, 1, r0, r0, beamButtEnum, beamButtEnum),
        createBeam(0, 3, r0, r1, beamSphereEnum, beamButtEnum),
        createBeam(4, 5, r0, r2, beamSphereEnum, beamButtEnum),
        createBeam(6, 7, r0, r3, beamHemiSphereEnum, beamButtEnum),
        createBeam(0, 1, r1, r0, beamHemiSphereEnum, beamButtEnum),
        createBeam(5, 4, r1, r1, beamSphereEnum, beamHemiSphereEnum),
        createBeam(2, 3, r1, r2, beamSphereEnum, beamSphereEnum),
        createBeam(7, 6, r1, r3, beamButtEnum, beamButtEnum),
        createBeam(1, 2, r2, r2, beamButtEnum, beamButtEnum),
        createBeam(6, 5, r2, r3, beamHemiSphereEnum, beamButtEnum),
        createBeam(3, 0, r3, r0, beamButtEnum, beamSphereEnum),
        createBeam(4, 7, r3, r1, beamHemiSphereEnum, beamHemiSphereEnum),
    ];

    // console.log(beams)

    // Add vertices to the mesh object
    for (let i = 0; i < vertices.length; i++) {
        meshObject.SetVertex(i, vertices[i]);
    }

    // Get the beam lattice and add beams
    const beamLattice = meshObject.BeamLattice();
    // beamLattice.SetBeams(beams);
    for (let i = 0; i < beams.length; i++) {
        beamLattice.AddBeam(beams[i]);
    }

    // Set beam min length
    beamLattice.SetMinLength(0.005);

    // Get identity transform
    const transform = lib3mf.GetIdentityTransform();

    // Add mesh object to the model as a build item
    model.AddBuildItem(meshObject, transform);

    // Write the model to a 3MF file
    const writer = model.QueryWriter('3mf');
    writer.WriteToFile('beamlattice.3mf');

    console.log("3MF file with beam lattice written successfully to 'beamlattice.3mf'");
}

main();
