/*

Doesnt work, will be updated later

const rpc = require("discord-rpc");

const _ = new rpc.Client({ transport: 'ipc' });

_.on("ready", () => {
    _.setActivity({
        details: "Using EthyrMC",
        state: "https://github.com/0xffabc/EthyrMC",
        largeImageKey: "./features/ethyr.jpg"
    });
    setInterval(() => {
        _.setActivity({
            details: "Using EthyrMC",
            state: "https://github.com/0xffabc/EthyrMC",
            largeImageKey: "./features/ethyr.jpg"
        });
    }, 15000);
});

*/