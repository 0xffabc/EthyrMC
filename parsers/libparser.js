
function libParser(libName) {
    const rootFolder = libName.split(".")[0];
    
    const fullPath = (rootFolder ? rootFolder + "/" : "") + libName.split(":").join("/") + ".jar";

    return fullPath;
}

module.exports = libParser;