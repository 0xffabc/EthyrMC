const {
    axios,
    fs,
    config
} = global;

const decompress = require("decompress");

let version;
let CLIENT_URL = "";
let CLIENT_DATA = "";
// Reset screen
const resetScreen = (i = 0) => {
    while (i++ < process.stdout.rows) console.log(" ");
}
// Installer 
// MasterFile => path, downloadUrl
let maxDown = 760;
let startTime = 0;

const completeInstall = () => {
    fs.readdirSync("minecraft/natives/" + version).filter(e => e.includes(".jar")).forEach(zip => 
        decompress("minecraft/natives/" + version + "/" + zip, "minecraft/natives/" + version).catch(e => {}));
}

const downloadAll = downloads => {

    if (!startTime) {
        maxDown = downloads.length;
        startTime = Date.now();
    }

    resetScreen();
    console.log("[EthyrInternal] [" + (Math.fround(100 - (downloads.length / maxDown * 100))
        .toFixed(2)) + "%] -> Downloaded");
    let file = downloads.shift();
    let final;
    if (!file) {
        final = true;
        file = ["minecraft/versions/" + version + "/" + version + ".jar", CLIENT_URL];
        fs.writeFileSync("minecraft/versions/" + version + "/" + version + ".json", JSON.stringify(CLIENT_DATA));
    }
    console.log("=== File Info ===");
    console.log("Filename: " + file[0].split("/")[file[0].split("/")
        .length - 1]);
    console.log("Minecraft Client version " + version);
    console.log("Path to file: " + file[0]);
    console.log("Artifact download URL: " + file[1]);
    console.log("Uptime: " + Math.floor((Date.now() - startTime) / 1000) + "s");
    console.log("Actual path: " + file[0].split("/").slice(0, -1).join("/"));
    try {
        fs.mkdirSync(file[0].split("/").slice(0, -1).join("/"), {
            recursive: true
        });
    } catch(e) {}
    axios({
            method: "GET",
            url: file[1],
            responseType: "stream"
        })
        .then(res => {
            res.data.pipe(fs.createWriteStream(file[0]));
        })
        .catch(error => {
            if (error instanceof AggregateError) return;
            if (error.toString() == "AggregateError") return;
            if (error.name == "AggregateError") return;

            console.log("[Master] Pushing " + file[0] + " to the queue end with error: " + error);
            downloads.push(file);
        })
        .finally(() => final ? completeInstall() : setImmediate(() => downloadAll(downloads)));
};
const startInstall = (username, versionId) => {
    let downloads = [];
    version = versionId;
    fetch(config.version_manifest)
        .then(e => e.json())
        .then(versions => {
            const version = versions.versions.find(obj => obj.id == versionId);
            console.log("[System] Found version " + versionId + " at url " + version.url);
            fetch(version.url)
                .then(e => e.json())
                .then(version => {
                    setTimeout(() => {
                        try {
                            fs.mkdirSync("minecraft/versions/" + versionId);
                            fs.mkdirSync("minecraft/natives/" + versionId);
                        } catch(e) { }
                        downloads.push("minecraft/versions/" + versionId + "/" + versionId + ".jar", version.downloads.client.url);
                        console.log("[Downloader] Client.jar has been pushed to queue");
                        CLIENT_URL = version.downloads.client.url;
                        fetch(version.assetIndex.url)
                        .then(e => e.json())
                        .then(assets => {
                            fs.writeFileSync("minecraft/assets/indexes/" + version.assetIndex.id + ".json", Buffer.from(JSON.stringify(assets), "utf-8"));

                            Object.keys(assets.objects).forEach((asset, index, { length }) => {
                                const assetUrl = "https://resources.download.minecraft.net/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash;
                                downloads.push(["minecraft/assets/objects/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash, assetUrl]);
                                console.log("[Downloader] Saved " + asset);

                                if (index == length - 1) downloadAll(downloads);
                            });
                        });
                    }, version.libraries.length);
                    CLIENT_DATA = version;
                    version.libraries.forEach(lib => {
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
                    });
                });
        });
}
module.exports = startInstall;