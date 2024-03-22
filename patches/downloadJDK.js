const extractor = require("extract-zip");
const axios = require("axios");

const jdk9 = "https://download.java.net/openjdk/jdk9/ri/jdk-9+181_windows-x64_ri.zip";

axios({
		method: "GET",
		url: jdk9,
		responseType: "stream"
}).then(res => {
	res.data.pipe(fs.createWriteStream("./JDK"));
})