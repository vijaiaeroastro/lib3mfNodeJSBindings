console.log("Loading Lib3MF");

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

var wrapper = require('/home/vijai/Code/3MF/lib3mfNodeJS/build/Release/3mf_nodeaddon.node')('/home/vijai/Code/3MF/lib3mfNodeJS/lib3mf.so');

console.log("creating Model");
model = wrapper.CreateModel();

console.log("creating Reader");
reader = model.QueryReader("3mf");

console.log(wrapper.GetLibraryVersion())
console.log(wrapper.GetBuildInformation())
// console.log(getAllMethods(model));


console.log("load 3MF file");
reader.ReadFromFile("/home/vijai/Downloads/triangle.3mf");
// console.log(len(model.GetMeshObjects()))

console.log("creating Writer");
writer = model.QueryWriter("stl");

console.log("write stl file");
writer.WriteToFile("triangle_converted.stl");

console.log("done");
