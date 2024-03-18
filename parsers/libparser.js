// optifine:OptiFine:1.8.8_HD_U_I7
// net.minecraft:launchwrapper:1.12

function libParser(libName) {
    const groups = libName.split(":");
    const group0 = groups[0].split(".");
    const group1 = groups.slice(1, groups.length - 1);
    const version = groups[groups.length - 1];
    const artifact = groups[groups.length - 2];
    const filename = artifact + "-" + version + ".jar";
    const fullPath = group0.join("/") + "/" + group1.join("/") + "/" + filename;
    console.log("[Debug] Generated path: " + fullPath);

    return fullPath;
}

module.exports = libParser;