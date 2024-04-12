
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
	const assetsDir = "./minecraft/assets/";
	const nativesDir = "./minecraft/natives/";
	const clientJar = "./minecraft/versions/" + version + "/" + version + ".jar";
	const {
		mainClass, assets
	} = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
               const minecraft = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
               const libs = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json")).libraries;
               const minecraftArguments = minecraft.minecraftArguments ? minecraft.minecraftArguments : minecraft.arguments.game.filter(e => typeof e !== "object").join(" ");
               const classpath = (minecraft.inheritsFrom ? resolve("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".jar;") : resolve(clientJar)) + ";" + libs.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || parseLib(e?.downloads?.artifact?.name || e?.name)))).join(";") + (minecraft.inheritsFrom ? ";" + (JSON.parse(fs.readFileSync("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".json")).libraries.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || parseLib(e?.downloads?.artifact?.name || e?.name))))).join(";") : "");
	let command = javaP + ' -Dfml.ignoreInvalidMinecraftCertificates=true -Dfml.ignorePatchDiscrepancies=true -Djava.net.preferIPv4Stack=true -XX:HeapDumpPath=intel_ez_javaw.exe_minecraft.exe -javaagent:./ely.by/authlib-injector-1.2.5.jar=ely.by -D"org.lwjgl.librarypath"="' + resolve(nativesDir) + '" -D"java.library.path"="' + resolve(nativesDir) + '" -cp ' + classpath + ' ' + mainClass + ' ' + minecraftArguments.replace("${auth_player_name}", username)
		.replace("${version_name}", version)
		.replace("${game_directory}", resolve("./minecraft"))
		.replace("${assets_root}", '"' + resolve(assetsDir.split("/")
			.slice(0, -1)
			.join("/")) + '"')
		.replace("${assets_index_name}", '"' + assets + '"')
		.replace("${auth_uuid}", uuid)
		.replace("--accessToken ${auth_access_token}", "")
		.replace("${user_properties}", "normal")
		.replace("${classpath}", classpath)
                              .replace("${user_type}", "full")
                              .replace("${natives_directory}", resolve(nativesDir))
                              .replace("${version_type}", "EthyrMC") + " --accessToken null";
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
	(require("child_process")).spawn(patchGCMem(command), { shell: true, stdio: "inherit" }).on("exit", () => {  });
}
module.exports = launch;
