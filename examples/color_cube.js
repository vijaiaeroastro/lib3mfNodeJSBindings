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
    mesh.AddVertex(position);

    return position;
}

// Helper function to add a triangle to the mesh object using three vertex indices
function addTriangle(mesh, p1, p2, p3) {
    const triangle = {
        Indices: [p1, p2, p3],
    };

    // Add triangle to the mesh
    mesh.AddTriangle(triangle);

    return triangle;
}

// Helper function to create a color group for triangles
function createTriangleColor(colorGroup, colorID1, colorID2, colorID3) {
    const colorResourceId = colorGroup.GetResourceID();
    const triangleProperties = {
        ResourceID: colorResourceId,
        PropertyIDs: [colorID1, colorID2, colorID3],
    };
    return triangleProperties;
}

// Helper function to create a color in RGBA format
function createColor(wrapper, red, green, blue, alpha) {
    return wrapper.RGBAToColor(red, green, blue, alpha);
}

function main() {
    try {
        // Initialize the lib3mf wrapper
        const version = lib3mf.GetLibraryVersion();
        console.log(`lib3mf version: ${version}`);

        // Create a new 3MF model
        const model = lib3mf.CreateModel();

        // Add a mesh object and set its name
        const meshObject = model.AddMeshObject();
        // meshObject.SetName("Colored Box");

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
            createVertex(meshObject, 0, fSizeY, fSizeZ)
        ];

        // Define triangles by vertices indices
        const triangleIndices = [
            [2, 1, 0], [0, 3, 2], [4, 5, 6], [6, 7, 4],
            [0, 1, 5], [5, 4, 0], [2, 3, 7], [7, 6, 2],
            [1, 2, 6], [6, 5, 1], [3, 0, 4], [4, 7, 3]
        ];

        // Add triangles to the mesh
        const triangles = [];
        triangleIndices.forEach(indices => {
            const triangle = addTriangle(meshObject, indices[0], indices[1], indices[2]);
            triangles.push(triangle);
        });

        // Set geometry on the mesh object
        meshObject.SetGeometry(vertices, triangles);

        // Create color group
        const colorGroup = model.AddColorGroup();
        console.log(Object.getPrototypeOf(colorGroup));
        console.log(getAllMethods(colorGroup))

        // Define colors
        const idRed = colorGroup.AddColor(createColor(lib3mf, 255, 0, 0, 255));
        const idGreen = colorGroup.AddColor(createColor(lib3mf, 0, 255, 0, 255));
        const idBlue = colorGroup.AddColor(createColor(lib3mf, 0, 0, 255, 255));
        const idOrange = colorGroup.AddColor(createColor(lib3mf, 255, 128, 0, 255));
        const idYellow = colorGroup.AddColor(createColor(lib3mf, 255, 255, 0, 255));

        // Set triangle colors
        const sTriangleColorRed = createTriangleColor(colorGroup, idRed, idRed, idRed);
        const sTriangleColorGreen = createTriangleColor(colorGroup, idGreen, idGreen, idGreen);
        const sTriangleColorBlue = createTriangleColor(colorGroup, idBlue, idBlue, idBlue);
        const sTriangleColor1 = createTriangleColor(colorGroup, idOrange, idRed, idYellow);
        const sTriangleColor2 = createTriangleColor(colorGroup, idYellow, idGreen, idOrange);

        // One-colored triangles
        for (let i = 0; i <= 5; i++) {
            switch (i) {
                case 0:
                case 1:
                    meshObject.SetTriangleProperties(i, sTriangleColorRed);
                    break;
                case 2:
                case 3:
                    meshObject.SetTriangleProperties(i, sTriangleColorGreen);
                    break;
                case 4:
                case 5:
                    meshObject.SetTriangleProperties(i, sTriangleColorBlue);
                    break;
            }
        }

        // Gradient-colored triangles
        for (let i = 6; i <= 11; i++) {
            if (i % 2 === 0) {
                meshObject.SetTriangleProperties(i, sTriangleColor1);
            } else {
                meshObject.SetTriangleProperties(i, sTriangleColor2);
            }
        }

        // Set object level property
        meshObject.SetObjectLevelProperty(sTriangleColorRed.ResourceID, sTriangleColorRed.PropertyIDs[0]);

        // Save to a 3MF file
        const writer3MF = model.QueryWriter('3mf');
        writer3MF.WriteToFile("colorcube.3mf");

        console.log("3MF file with a colored cube written successfully to 'colorcube.3mf'");

    } catch (error) {
        console.error("An error occurred:", error);
        process.exit(1); // Exit with a failure code
    }
}

main();