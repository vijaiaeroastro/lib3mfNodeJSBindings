const lib3mf = require('./lib3mf');

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

// Helper function to create a translation matrix
function createTranslationMatrix(x, y, z) {
    const matrix = {
        Fields: [
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [x, y, z]
        ]
    };
    return matrix;
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
        // meshObject.SetName("Box");

        // Define the size of the box
        const fSizeX = 10.0, fSizeY = 20.0, fSizeZ = 30.0;

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

        // Initialize an empty array for triangles
        const triangles = [];

        // Add triangles to the mesh
        for (let i = 0; i < triangleIndices.length; i++) {
            const indices = triangleIndices[i];
            const triangle = addTriangle(meshObject, indices[0], indices[1], indices[2]);
            triangles.push(triangle);
        }

        // Set geometry on the mesh object
        meshObject.SetGeometry(vertices, triangles);

        // Add a components object
        const componentsObject = model.AddComponentsObject();

        // Add components with different transformations
        componentsObject.AddComponent(meshObject, createTranslationMatrix(0.0, 0.0, 0.0));
        componentsObject.AddComponent(meshObject, createTranslationMatrix(40.0, 60.0, 80.0));
        componentsObject.AddComponent(meshObject, createTranslationMatrix(120.0, 30.0, 70.0));

        // Add the components object to the build items
        model.AddBuildItem(componentsObject, createTranslationMatrix(0.0, 0.0, 0.0));

        // Save to a 3MF file
        const writer3MF = model.QueryWriter('3mf');
        writer3MF.WriteToFile("components.3mf");

        // Save to an STL file
        const writerSTL = model.QueryWriter('stl');
        writerSTL.WriteToFile("components.stl");

        console.log("3MF and STL files with components written successfully to 'components.3mf' and 'components.stl'");

    } catch (error) {
        console.error("An error occurred:", error);
        process.exit(1); // Exit with a failure code
    }
}