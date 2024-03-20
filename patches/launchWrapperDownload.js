const axios = require("axios");
const fs = require("fs");

const url = "https://libraries.minecraft.net/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar";
const path = "./minecraft/libraries/net/minecraft/launchwrapper/1.12/launchwrapper-1.12.jar";

fs.mkdirSync(path.split("/").slice(0, -1).join("/"), { recursive: true });
axios({
    method: "GET",
    url: url,
    responseType: "stream"
}).then(res => {
    console.log("[*] LaunchWrapper downloaded");
    const stream = fs.createWriteStream(path);

    res.data.pipe(stream);
    stream.on("error", () => console.log("[*] LauncherWrapper exists"));
})