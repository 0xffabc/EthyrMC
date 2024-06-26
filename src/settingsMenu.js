
const { fs, prompt } = global;

// stapsi ah
let rowsPassed = 0;
const rows = process.stdout.rows;

// Screen
const resetScreen = () => {
	let i = 0;
	while (i++ < rows) console.log(" ");
}

function settingsMenu() {
    console.log("[Minecraft] Settings");
    const mcSettings = fs.readFileSync("./minecraft/options.txt").toString();

    const { EOL } = require("os");
    const settingsSplit = mcSettings.split(EOL);
    const settingsJsonLike = settingsSplit.map(e => e.split(":"));
    const keys = settingsJsonLike.map(setting => setting[0]);
    const values = settingsJsonLike.map(setting => setting[1]);
    
    keys.forEach((key, index) => {
        console.log(key + " -> " + values[index] + " => ID: " + index);
    });

    while (true) {
        const subCommand = prompt("[EthyrOptionsSetup] -> ");
        const num = parseInt(subCommand);
        if (!isNaN(num)) {
            console.log("[EthyrOptionsSetup] Selected index: " + num);
            const value = prompt("Value for " + keys[num] + " -> ");
            const optionsNew = fs.readFileSync("./minecraft/options.txt").toString().split(EOL).map(setting => setting.startsWith(keys[num]) ? setting.split(":")[0] + ":" + value : setting).join(EOL);
            fs.writeFileSync("./minecraft/options.txt", optionsNew);
            console.log("[EthyrOptionsSetup] Wrote to ./minecraft/options.txt");
        } else if (subCommand == "quit") break;
    }
}
module.exports = settingsMenu;