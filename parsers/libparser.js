
function libParser(libName) {
    const pathSplit = libName.replaceAll(".", "/").replaceAll(":", "/");
    const fullPath = pathSplit + pathSplit[pathSplit.length - 1] + ".jar";
    console.log("[Debug] Parsed path: " + fullPath);

    return fullPath;
}

module.exports = libParser;