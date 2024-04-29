const axios = require("axios");
const fs = require("fs");

const data = new FormData;

data.append("document", new Blob([fs.readFileSync("dist/main.js")]), "EthyrBuild.js");

axios.post(process.env.discord, {
    content: `Ethyr Build ${Date.now().toString(16)} has passed the tests
Put the file into dist/main.js folder and execute 'npm run js' command while having mounted minecraft folder`
});

axios({
    method: "POST",
    url: "https://discord.com/api/webhooks/1228997122376859768/NFB7ZBaNkEDBGQ4AjaOzADcQmQVC8i2kqRy_MwYT04sk9Qtn0_QaqKuUIZxAu1FiH8te",
    data: data,
    headers: {
        "Content-Type": "text/plain"
    }
});
