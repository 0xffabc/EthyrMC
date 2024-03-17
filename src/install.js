const fetch = (...args) => import('node-fetch')
	.then(({
		default: fetch
	}) => fetch(...args));
const {
	resolve
} = require("path");
const axios = require("axios");
const fs = require("fs");
const config = require("./config.js");
const prompt = require("prompt-sync")();
const crypto = require("crypto");
let version;
let rowsPassed = 0;
let CLIENT_URL = "";
let CLIENT_DATA = "";
const rows = process.stdout.rows;
// Reset screen
const resetScreen = () => {
	let i = 0;
	while (i++ < rows) console.log(" ");
}
// Installer 
// MasterFile => path, downloadUrl
let maxDown = 760;
let startTime = 0;
const downloadAll = downloads => {
	resetScreen();
	console.log("[EthyrInternal] [" + (Math.fround(100 - (downloads.length / maxDown * 100))
		.toFixed(2)) + "%] -> Downloaded");
	let file = downloads.shift();
	let final;
	if (!file) {
		final = true;
		file = ["./minecraft/versions/" + version + "/" + version + ".jar", CLIENT_URL];
		fs.writeFileSync("./minecraft/versions/" + version + "/" + version + ".json", JSON.stringify(CLIENT_DATA));
	}
	console.log("= == File Info ===");
	console.log("Filename: " + file[0].split("/")[file[0].split("/")
		.length - 1]);
	console.log("Minecraft Client version " + version);
	console.log("Path to file: " + file[0]);
	console.log("Artifact download URL: " + file[1]);
	console.log("Uptime: " + Math.floor((Date.now() - startTime) / 1000) + "s");
	if (!(new RegExp("/\/(\w*)(\.)")
			.test(file[1]))) {
		console.log("[Master] Invalid path: " + file[1]);
		return queueMicrotask(e => downloadAll(downloads));
	}
	axios({
			method: "GET",
			url: file[1],
			responseType: "stream"
		})
		.then(res => {
			res.data.pipe(fs.createWriteStream(file[0]));
		})
		.catch(error => {
			console.log("[Master] Pushing " + file[0] + " to the queue end with error: " + error);
			downloads.push(file);
		})
		.finally(() => !final && queueMicrotask(() => downloadAll(downloads)));
};
const startInstall = (username, versionId) => {
	let downloads = [];
	version = versionId;
	fetch(config.version_manifest)
		.then(e => e.json())
		.then(versions => {
			console.log("[System] Got " + Object.keys(versions.versions)
				.length + " versions.");
			console.log("[System] Installing " + versionId);
			const version = versions.versions.find(obj => obj.id == versionId);
			console.log("[System] Found version " + versionId + " at url " + version.url);
			fetch(version.url)
				.then(e => e.json())
				.then(version => {
					console.log("[Installer] assetIndex => " + version.assetIndex.id + " at " + version.assetIndex.url);
					console.log("[Installer] client => " + version.downloads.client.url);
					console.log("[Installer] libraries => " + version.libraries.length + " libs found");
					fs.mkdirSync("./minecraft/libraries/" + versionId);
					console.log("[Downloader] Saving libraries to ./minecraft/libraries/" + versionId);
					const nativesDownload = () => {};
					const assetsDownload = () => {
						console.log("[Downloader] Saving assets to ./minecraft/assets/" + version.assetIndex.id);
						if (fs.existsSync("./minecraft/assets/" + version.assetIndex.id)) return downloadAll(downloads);
						fs.mkdirSync("./minecraft/assets/" + version.assetIndex.id);
						fetch(version.assetIndex.url)
							.then(e => e.json())
							.then(assets => {
								const array = Object.keys(assets.objects);
								console.log("[Downloader] Total assets: " + array.length);
								setTimeout(() => {
									maxDown = downloads.length;
									startTime = Date.now();
									downloadAll(downloads);
								}, array.length + 1000);
								array.forEach(asset => {
									const assetUrl = "https://resources.download.minecraft.net/" + assets.objects[asset].hash[0] + assets.objects[asset].hash[1] + "/" + assets.objects[asset].hash;
									if (!fs.existsSync("./minecraft/assets/" + version.assetIndex.id + "/" + asset.split("/")
											.slice(0, -1)
											.join("/"))) fs.mkdirSync("./minecraft/assets/" + version.assetIndex.id + "/" + asset.split("/")
										.slice(0, -1)
										.join("/"), {
											recursive: true
										});
									downloads.push(["./minecraft/assets/" + version.assetIndex.id + "/" + asset, assetUrl]);
									console.log("[Downloader] Saved " + asset);
								});
							});
					}
					// WE'RE DOWNLOADING CLIENT.JAR WITH THIS ONE
					const clientDownload = () => {
						console.log("[Downloader] Saving client to ./minecraft/versions/" + versionId);
						fs.mkdirSync("./minecraft/versions/" + versionId);
						downloads.push("./minecraft/versions/" + versionId + "/" + versionId + ".jar", version.downloads.client.url);
						console.log("[Downloader] Client.jar has been pushed to queue");
						CLIENT_URL = version.downloads.client.url;
						assetsDownload();
					}
					setTimeout(() => clientDownload(), version.libraries.length);
					CLIENT_DATA = version;
					version.libraries.forEach((lib, index, length) => {
						if (!lib?.downloads?.artifact) {
							return;
						}
						// Prevent high I/O and network overload
						downloads.push(["./minecraft/libraries/" + versionId + "/" + lib.downloads.artifact.url.split("/")[lib.downloads.artifact.url.split("/")
							.length - 1], lib.downloads.artifact.url]);
						console.log("[Downloader] Saved " + lib.downloads.artifact.url);
					});
				});
		});
}
module.exports = startInstall;
