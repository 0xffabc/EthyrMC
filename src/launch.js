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

function launch(version, username, uuid) {
	const libs = fs.readdirSync("./minecraft/libraries/" + version);
	const assetIndex = "1.8";
	const assetsDir = "./minecraft/assets/";
	const nativesDir = "./minecraft/natives/";
	const clientJar = "./minecraft/versions/" + version + "/" + version + ".jar";
	const {
		mainClass,
		minecraftArguments
	} = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
	let command = 'java -D"java.library.path"="' + resolve(nativesDir) + '" -cp "' + resolve(clientJar) + ";" + libs.map(e => resolve("./minecraft/libraries/" + version + "/" + e))
		.join(";") + '" ' + mainClass + ' ' + minecraftArguments.replace("${auth_player_name}", username)
		.replace("${version_name}", version)
		.replace("${game_directory}", resolve("./minecraft"))
		.replace("${assets_root}", '"' + resolve(assetsDir.split("/")
			.slice(0, -1)
			.join("/")) + '"')
		.replace("${assets_index_name}", '"' + assetIndex + '"')
		.replace("${auth_uuid}", uuid)
		.replace("--accessToken ${auth_access_token}", "")
		.replace("${user_properties}", "normal")
		.replace("${user_type}", "full") + " --accessToken letmeplaylol";
	console.log("[Ethyr] Command generated: " + command);
	(require("child_process"))
	.execSync(command);
}
module.exports = launch;
