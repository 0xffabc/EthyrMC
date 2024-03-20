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

const startInstaller = require("./src/install.js");
const validate = require("./src/validate.js");
const launch = require("./src/launch.js");
const settingsMenu = require("./src/settingsMenu.js");
const fixLauncherWrapper = require("./patches/launchWrapperDownload.js");
const settings = (fs.readFileSync("./settings.txt", "utf8") || ";").split(";") || [];

let CLIENT_DATA = "";
let username = settings[1] || "unknown";
let uuid = "";
let version = settings[0] || "NULL";
let rowsPassed = 0;
let CLIENT_URL = "";
const rows = process.stdout.rows;
// Patch console.log
console.log = new Proxy(console.log, {
	apply(target, that, args) {
		rowsPassed++;
		return target.apply(that, args);
	}
});
// Screen
const resetScreen = () => {
	let i = 0;
	while (i++ < rows) console.log(" ");
}
// Table
const reloadTable = () => {
	console.log("  = = = Ethyr = = = ");
	console.log("EthyrMC Commands:");
	console.log("- [install] => select minecraft version to install it");
	console.log("- [username] => set account username");
	console.log("- [setversion] => set version you're working with");
	console.log("- [setuuid] => set auth UUID of mojang account, needed for online servers");
	console.log("- [validate] => check if version hashes match with official");
	console.log("- [clear] => remove file of versions you're working with");
	console.log("- [settings] => manage minecraft settings");
	console.log("- [launch] => launch currently selected version");
	console.log("- [quit] => quit the program");
	console.log("==============");
};
// Pre-Render
resetScreen();
reloadTable();
// Command loop
while (true) {
	if (rowsPassed >= rows) {
		resetScreen();
		reloadTable();
		rowsPassed = 0;
	};
	console.log("User -> " + username + ", Version -> " + version);
	const command = prompt("[Eth] -> ");
	if (command == "username") {
		username = prompt("[Change Username] -> ");
	} else if (command == "quit") {
                  const file = fs.writeFileSync("./settings.txt", version + ";" + username);
                  break;
               } else if (command == "setversion") {
		version = prompt("[Enter Version] -> ");
	} else if (command == "install") {
		if (prompt("[Warning!] Doing so will kick you out from command loop! Are you sure? [y/n] ") !== "y") continue;
		startInstaller(username, version);
		break;
	} else if (command == "clear") {
		if (fs.statSync("./minecraft/libraries/" + version)) fs.rmSync("./minecraft/libraries/" + version, {
			recursive: true
		});
		if (fs.statSync("./minecraft/versions/" + version)) fs.rmSync("./minecraft/versions/" + version, {
			recursive: true
		});
	} else if (command == "launch") {
		launch(version, username, uuid);
	} else if (command == "validate") {
		validate(version);
		break;
	} else if (command == "settings") {
                              resetScreen();
                              settingsMenu();
               }
};
