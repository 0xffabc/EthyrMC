
const patchGCMem = require("../patches/garbageCollector.js");

const { axios, fs, prompt, crypto, resolve, fetch } = global;

const config = require("./config.js");
const parseLib = require("../parsers/libparser.js");

let version;
let downloads = [];
let rowsPassed = 0;
let CLIENT_URL = "";
let CLIENT_DATA = "";
let shouldntStart;
const rows = process.stdout.rows;

function launch(version, username, uuid = "a", javaP) {
	const assetIndex = "1.8";
	const assetsDir = "./minecraft/assets/";
	const nativesDir = "./minecraft/natives/";
	const clientJar = "./minecraft/versions/" + version + "/" + version + ".jar";
	const {
		mainClass
	} = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
               const minecraft = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
               const libs = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json")).libraries;
               const minecraftArguments = minecraft.minecraftArguments ? minecraft.minecraftArguments : minecraft.arguments.game.filter(e => typeof e !== "object").join(" ");
	let command = javaP + ' -D"org.lwjgl.librarypath"="' + resolve(nativesDir) + '" -D"java.library.path"="' + resolve(nativesDir) + '" -cp "' + (minecraft.inheritsFrom ? resolve("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".jar;") : "") + resolve(clientJar) + ";" + libs.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || e?.downloads?.classifiers["natives-" + (process.platform == "win32" ? "windows" : (process.platform == "darwin" ? "macos" : "linux"))]?.path || parseLib(e?.downloads?.artifact?.name || e?.downloads?.classifiers?.name || e?.name))))
		.join(";") + ";" + (minecraft.inheritsFrom ? (JSON.parse(fs.readFileSync("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".json")).libraries.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || e?.downloads?.classifiers["natives-" + (process.platform == "win32" ? "windows" : (process.platform == "darwin" ? "macos" : "linux"))]?.path || parseLib(e?.downloads?.artifact?.name || e?.downloads?.classifiers?.name || e?.name))))).join(";") : "") + '" ' + mainClass + ' ' + minecraftArguments.replace("${auth_player_name}", username)
		.replace("${version_name}", version)
		.replace("${game_directory}", resolve("./minecraft"))
		.replace("${assets_root}", '"' + resolve(assetsDir.split("/")
			.slice(0, -1)
			.join("/")) + '"')
		.replace("${assets_index_name}", '"' + assetIndex + '"')
		.replace("${auth_uuid}", uuid)
		.replace("--accessToken ${auth_access_token}", "")
		.replace("${user_properties}", "normal")
		.replace("${user_type}", "full")
                              .replace("${version_type}", "EthyrMC") + " --accessToken letmeplaylol";
	console.log("[Ethyr] Command generated: " + patchGCMem(command));

               function download(arr, run) {
                   if (arr.length == 0) return run();

                   const file = arr.shift();
                   axios({
                       method: "GET",
                       url: file[0],
                       responseType: "stream"
                   }).then(res => {
                       console.log("[lib] -> " + file[1]);
                       res.data.pipe(fs.createWriteStream(file[1]));
                   }).catch(err => {
                       console.log("[ERR] Pushed " + file[0] + " to the queue end: " + err.stack);
                       arr.push(file);
                   }).finally(eve => {
                       setTimeout(() => download(arr, run), 200);
                   });
               }
               
               console.log("Missing libraries: " + downloads);
               if (downloads && prompt("Do you want to download libs? (empty -> skip)")) download(downloads, () => (require("child_process")).execSync(patchGCMem(command)));
	(require("child_process")).execSync(patchGCMem(command));
}
module.exports = launch;
