const { fs, resolve } = global;

const parseLib = require("../parsers/libparser.js");
const rows = process.stdout.rows;
const { spawn } = require("child_process");

function launch(version, username, uuid = "a", javaP, javaagent = true, fullscreen = true) {
	const minecraft = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
	const assetsDir = "./minecraft/assets/";
	const nativesDir = "./minecraft/natives/" + (minecraft.inheritsFrom ? minecraft.inheritsFrom : version);
	const clientJar = "./minecraft/versions/" + version + "/" + version + ".jar";
	const {
		mainClass, assets
	} = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
               const libs = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json")).libraries;
               const minecraftArguments = minecraft.minecraftArguments ? minecraft.minecraftArguments : minecraft.arguments.game.filter(e => typeof e !== "object").join(" ");
               const classpath = (minecraft.inheritsFrom ? resolve("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".jar;") : resolve(clientJar)) + ";" + libs.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || parseLib(e?.downloads?.artifact?.name || e?.name)))).join(";") + (minecraft.inheritsFrom ? ";" + (JSON.parse(fs.readFileSync("./minecraft/versions/" + minecraft.inheritsFrom + "/" + minecraft.inheritsFrom + ".json")).libraries.map(e => resolve("./minecraft/libraries/" + (e?.downloads?.artifact?.path || parseLib(e?.downloads?.artifact?.name || e?.name))))).join(";") : "");
                  const command = `${javaP} ${javaagent ? "-javaagent:./ely.by/authlib-injector-1.2.5.jar=ely.by " : ""}${fullscreen?"-Dorg.lwjgl.opengl.Window.undecorated=true ":" "}-D"java.library.path"=${resolve(nativesDir)} -cp ${classpath} ${mainClass} ${minecraftArguments.replace("${auth_player_name}", username).replace("${version_name}", version)
		.replace("${game_directory}", resolve("./minecraft"))
		.replace("${assets_root}", '"' + resolve(assetsDir.split("/")
			.slice(0, -1)
			.join("/")) + '"')
		.replace("${assets_index_name}", '"' + assets + '"')
		.replace("${auth_uuid}", uuid)
		.replace("${auth_access_token}", "null")
		.replace("${user_properties}", "{}")
		.replace("${classpath}", classpath)
                              .replace("${user_type}", "mojang")
                              .replace("${natives_directory}", resolve(nativesDir))
                              .replace("${version_type}", "EthyrMC")} ${fullscreen?"--width=1920 --height=1080":""}`;
               console.log(command);
	spawn(command, { shell: true, stdio: "inherit" }).on("exit", () => {  });
}
module.exports = launch;
