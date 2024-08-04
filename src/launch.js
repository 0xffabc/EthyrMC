const fs = global.fs;

const parseLib = require("../parsers/libparser.js");
const rows = process.stdout.rows;
const { spawn } = require("child_process");
const arch = process.platform == "win32" ? "windows" : (process.platform == "darwin" ? "osx" : "linux");

function launch(version, username, uuid, javaP, javaagent, fullscreen) {
    const minecraft = JSON.parse(fs.readFileSync("minecraft/versions/" + version + "/" + version + ".json"));
    const {
        mainClass,
        assets,
	inheritsFrom,
	libraries,
	minecraftArguments
    } = minecraft;
    const assetsDir = "minecraft/assets";
    const nativesDir = "minecraft/natives/" + (inheritsFrom ? inheritsFrom : version);
    const clientJar = "minecraft/versions/" + version + "/" + version + ".jar";
    const game = minecraft?.arguments?.game;
    const argsString = minecraftArguments || game.filter(arg => 
        typeof arg == "object" ? arg.allow == arch : arg).join(" ");
    const classpath = (inheritsFrom ? "minecraft/versions/" + inheritsFrom + "/" + inheritsFrom + ".jar;" : clientJar) + ";" + libraries.map(e => "minecraft/libraries/" + parseLib(e.name)).join(";") + (inheritsFrom ? ";" + JSON.parse(fs.readFileSync("minecraft/versions/" + inheritsFrom + "/" + inheritsFrom + ".json")).libraries.map(e => "minecraft/libraries/" + parseLib(e.name)).join(";") : "");
    const command = `${javaP} ${fullscreen ? "-Dorg.lwjgl.opengl.Window.undecorated=true ":""} -D"java.library.path"=${nativesDir} -cp ${classpath} ${mainClass} ${fullscreen ? "--width 1920 --height 1080" : ""} ${argsString.replace("${auth_player_name}", username).replace("${version_name}", version)
		.replace("${game_directory}", "minecraft")
		.replace("${assets_root}", assetsDir)
		.replace("${assets_index_name}", assets)
		.replace("${auth_uuid}", "null")
		.replace("${auth_access_token}", "null")
		.replace("${user_properties}", "{}")
		.replace("${classpath}", classpath)
        .replace("${user_type}", "mojang")
        .replace("${natives_directory}", nativesDir)
        .replace("${version_type}", "EthyrMC")}`;
    console.log(command);
    spawn(command, {
        shell: true,
        stdio: "inherit"
    });
};

module.exports = launch;
