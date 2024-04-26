const { fs } = global;

const directories = [];

directories.push("minecraft");
directories.push("minecraft/libraries");
directories.push("minecraft/versions");
directories.push("minecraft/natives");

directories.push("minecraft/assets");
directories.push("minecraft/assets/indexes");
directories.push("minecraft/assets/objects");
directories.push("minecraft/assets/skins");
directories.push("minecraft/assets/log_configs");

for (const path of directories) {
    if (fs.existsSync(path)) continue;

    fs.mkdirSync(path, {
        recursive: true
    });

    console.log("[*] Created " + path);
};

if (!fs.existsSync("settings.txt"))
    fs.writeFileSync("settings.txt", "");