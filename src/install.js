const {
    axios,
    fs,
    config
} = global;

const decompress = require("decompress");

let version, versionId_, 
	maxDown, startTime, client;
const type = process.platform == "win32" ? "windows" : (process.platform == "darwin" ? "osx" : "linux");

const resetScreen = (i = 0) => {
    console.clear();
}

const completeInstall = () => {
    const natives = fs.readdirSync("minecraft/natives/" + versionId_).filter(e => e.includes(".jar"));
    for (const zip of natives)
        decompress("minecraft/natives/" + versionId_ + "/" + zip, "minecraft/natives/" + versionId_).catch(console.log);
}

const downloadAll = async downloads => {
    if (downloads.length == 0) {
        fs.writeFileSync("minecraft/versions/" + versionId_ + "/" + versionId_ + ".json", JSON.stringify(client));
        return completeInstall();
    }; 
    let file = downloads.shift();
    const res = await axios({
        method: "GET",
        url: file[1],
        responseType: "stream"
    });
	  const perc = downloads.length / maxDown * 100;
	  console.log(` File: ${file[0].split("/")[file[0].split("/").length - 1]} Progress: [${(new Array(~~(perc))).fill("#").join("") + (new Array(100 - (~~(perc)))).fill(".").join("")}] ${perc}%`);
    fs.mkdirSync(file[0].split("/").slice(0, -1).join("/"), {
        recursive: true
    }, console.log);
    res.data.pipe(fs.createWriteStream(file[0]), console.log);
    setImmediate(() => downloadAll(downloads));
};
const startInstall = async (username, versionId) => {
    let downloads = [];
    let version = versionId_ = versionId;
    const req = await fetch(config.version_manifest);
    const versions = await req.json();
    version = versions.versions.find(obj => obj.id == versionId);
    const verReq = await fetch(version.url);
    client = version = await verReq.json();
    fs.mkdir("minecraft/versions/" + versionId, {}, console.log);
    fs.mkdir("minecraft/natives/" + versionId, {}, console.log);
    downloads.push(["minecraft/versions/" + versionId + "/" + versionId + ".jar", version.downloads.client.url]);
    
    for (const lib of version.libraries) {
        if (lib.downloads?.classifiers && lib.downloads.classifiers["natives-" + type]?.url) {
            const nativePath = "minecraft/natives/" + versionId + "/" + (lib.downloads.classifiers["natives-" + type].url.split("/")[lib.downloads.classifiers["natives-" + type].url.split("/").length - 1]);
            downloads.push([nativePath, lib.downloads.classifiers["natives-" + type].url]);
					  continue;
        }
			  if (!lib?.downloads?.artifact?.url) continue;
        downloads.push(["minecraft/libraries/" + lib?.downloads?.artifact?.path, lib.downloads.artifact.url]);
    };
    const assetsReq = await fetch(version.assetIndex.url);
    const assets = await assetsReq.json();
    fs.writeFileSync("minecraft/assets/indexes/" + version.assetIndex.id + ".json", Buffer.from(JSON.stringify(assets), "utf-8"));
    for (const asset in assets.objects) {
        const assetUrl = "https://resources.download.minecraft.net/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash;
        downloads.push(["minecraft/assets/objects/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash, assetUrl]);
    };
    maxDown = downloads.length;
    startTime = Date.now(); 
    downloadAll(downloads);
};

module.exports = startInstall;
