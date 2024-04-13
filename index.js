
global.axios = require("axios");
global.fs = require("fs");
global.config = require("./config.js");
global.prompt = require("prompt-sync")();
global.resolve = require("path").resolve;

const { axios, fs, config, prompt, crypto, resolve } = global;

const discordRpc = require("./features/rpc.js");
const startInstaller = require("./src/install.js");
const validate = require("./src/validate.js");
const launch = require("./src/launch.js");
const settingsMenu = require("./src/settingsMenu.js");
const fixLauncherWrapper = require("./patches/launchWrapperDownload.js");
const settings = (fs.readFileSync("./settings.txt", "utf8") || ";").split(";") || [];

let username = settings[1] || "unknown";
let uuid = "wtfgaysletmeplaypls";
let version = settings[0] || "NULL";
let rowsPassed = 0;
let javaP = settings[2] || "NULL";
let forcefs = settings[3] == "true" || false;
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
	console.log("EthyrMC Commands:");
	console.log("- [install] => select minecraft version to install it");
	console.log("- [username] => set account username");
	console.log("- [setversion] => set version you're working with");
	console.log("- [setuuid] => set UUID of mojang account");
	console.log("- [validate] => check if version hashes match with official");
	console.log("- [clear] => remove file of versions you're working with");
	console.log("- [settings] => manage minecraft settings");
	console.log("- [launch] => launch currently selected version");
               console.log("- [setjavap] => set path to java.exe.");
               console.log("- [setff] => sets minecraft to use borderless fullscreen");
	console.log("- [quit] => quit the program");
};
// Pre-Render
resetScreen();
reloadTable();
// Command loop
while (true) {
	if (rowsPassed >= 4) {
		resetScreen();
		reloadTable();
		rowsPassed = 0;
	};
	console.log("User -> " + username + ", Version -> " + version + ", java.exe path -> " + javaP);
	const command = prompt("[Eth] -> ");
	if (command == "username") {
		username = prompt("[Change Username] -> ");
	} else if (command == "quit") {
                  const file = fs.writeFileSync("./settings.txt", version + ";" + username + ";" + javaP + ";" + forcefs);
                  break;
               } else if (command == "setversion") {
		version = prompt("[Enter Version] -> ");
	} else if (command == "install") {
		resetScreen();
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
                              resetScreen();
		launch(version, username, uuid, javaP, true, forcefs);
                              break;
	} else if (command == "validate") {
		validate(version);
		break;
	} else if (command == "settings") {
                              resetScreen();
                              settingsMenu();
               } else if (command == "setjavap") {
                              javaP = prompt("[Change java path] JRE/JDK/OracleJava/Microsoft java java.exe path-> ");
               } else if (command == "setff") {
                              console.log("[Forceff] " + (forcefs = !forcefs));
               }
};
