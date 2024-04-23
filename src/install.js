const {
    axios,
    fs,
    config
} = global;

const decompress = require("decompress");

let version, versionId_, 
	CLIENT_URL = "",
	CLIENT_DATA = "",
	maxDown, startTime;

const resetScreen = (i = 0) => {
    while (i++ < process.stdout.rows) console.log(" ");
}

const completeInstall = () => {
    const natives = fs.readdirSync("minecraft/natives/" + versionId_).filter(e => e.includes(".jar"));
    for (const zip of natives)
        decompress("minecraft/natives/" + versionId_ + "/" + zip, "minecraft/natives/" + versionId_).catch(console.log);
}

const downloadAll = async downloads => {
    if (!downloads) return;
    resetScreen();
    console.log("[EthyrInternal] [" + (Math.fround(100 - (downloads.length / maxDown * 100))
        .toFixed(2)) + "%] -> Downloaded");
    let file = downloads.shift();
    const res = await axios({
        method: "GET",
        url: file[1],
        responseType: "stream"
    });
    res.data.pipe(fs.createWriteStream(file[0]), console.log);
    if (downloads.length == 0) {
        fs.writeFileSync("minecraft/versions/" + versionId_ + "/" + versionId_ + ".json", JSON.stringify(CLIENT_DATA));
        completeInstall();	
    };
    console.log("=== File Info ===");
    console.log("Filename: " + file[0].split("/")[file[0].split("/").length - 1]);
    console.log("Minecraft Client version " + versionId_);
    console.log("Path to file: " + file[0]);
    console.log("Artifact download URL: " + file[1]);
    console.log("Uptime: " + Math.floor((Date.now() - startTime) / 1000) + "s");
    console.log("Actual path: " + file[0].split("/").slice(0, -1).join("/"));
    fs.mkdir(file[0].split("/").slice(0, -1).join("/"), {
        recursive: true
    }, console.log);
    return setImmediate(() => downloadAll(downloads));
};
const startInstall = async (username, versionId) => {
    let downloads = [];
    let version = versionId_ = versionId;
    const req = await fetch(config.version_manifest);
    const versions = await req.json();
    version = versions.versions.find(obj => obj.id == versionId);
    console.log("[System] Found version " + versionId + " at url " + version.url);
    const verReq = await fetch(version.url);
    version = await verReq.json();
    fs.mkdir("minecraft/versions/" + versionId, {}, console.log);
    fs.mkdir("minecraft/natives/" + versionId, {}, console.log);
    downloads.push(["minecraft/versions/" + versionId + "/" + versionId + ".jar", version.downloads.client.url]);
    console.log("[Downloader] Client.jar has been pushed to queue");
    CLIENT_URL = version.downloads.client.url;
    CLIENT_DATA = version;
    for (const lib of version.libraries) {
        if (lib.downloads?.classifiers) {
            const type = process.platform == "win32" ? "windows" : (process.platform == "darwin" ? "osx" : "linux");
            if (lib.downloads.classifiers["natives-" + type]?.url) {
                const nativePath = "minecraft/natives/" + versionId + "/" + (lib.downloads.classifiers["natives-" + type].url.split("/")[lib.downloads.classifiers["natives-" + type].url.split("/").length - 1]);
                downloads.push([nativePath, lib.downloads.classifiers["natives-" + type].url]);
            }
        } else {
            downloads.push(["minecraft/libraries/" + lib?.downloads?.artifact?.path, lib.downloads.artifact.url]);
            console.log("[Downloader] Saved " + lib?.downloads?.artifact?.url);
        }
    };
    const assetsReq = await fetch(version.assetIndex.url);
    const assets = await assetsReq.json();
    fs.writeFileSync("minecraft/assets/indexes/" + version.assetIndex.id + ".json", Buffer.from(JSON.stringify(assets), "utf-8"));
    for (const asset in assets.objects) {
        const assetUrl = "https://resources.download.minecraft.net/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash;
        downloads.push(["minecraft/assets/objects/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash, assetUrl]);
        console.log("[Downloader] Saved " + asset);
    };
    maxDown = downloads.length;
    startTime = Date.now(); 
    downloadAll(downloads);
};

module.exports = startInstall;
