
const { fs, crypto } = global;

// stapsi ah
let rowsPassed = 0;
const rows = process.stdout.rows;
// hash comparator
function compareHash(file, hash_) {
	const f = fs.readFileSync(file);
	const hash = crypto.createHash("sha1");
	hash.update(f);
	const hashf = hash.digest("hex");
	return {
		match: hashf === hash_,
		hash: hashf
	};
}
// Screen
const resetScreen = () => {
	let i = 0;
	while (i++ < rows) console.log(" ");
}
// Validator
function validate(version) {
	resetScreen();
	const clientJar = "./minecraft/versions/" + version + "/" + version + ".jar";
	const version_ = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json"));
	const libs = JSON.parse(fs.readFileSync("./minecraft/versions/" + version + "/" + version + ".json")).libraries.map(e => "./minecraft/libraries/" + (e?.downloads?.artifact?.path));
	console.log("[Ethyr] Got " + (libs.length + 1) + " files.");
	// We use compareHash(path, originalHash) -> bool
	let start = Date.now();
	const hashDismatch = [];
	libs.forEach((lib, index, length) => {
		const libHash = version_.libraries.find(e => e.downloads?.artifact?.url?.split("/")
				?.pop() == lib)
			?.downloads?.artifact?.sha1;
		if (!libHash) return hashDismatch.push(lib);
		const doesMatch = compareHash("./minecraft/libraries/" + version + "/" + lib, libHash);
		setTimeout(() => {
			resetScreen();
			hashDismatch.forEach(e => console.log("[!] " + e + " -> CORRUPTED"));
			console.log("Hashing " + lib + " -> library");
			console.log("Uptime: " + Math.floor((Date.now() - start) / 1000) + "s" + " " + (index / (version_.libraries.length - hashDismatch.length) * 100)
				.toFixed(2) + "%")
			console.log("Original " + libHash + "  ->  " + doesMatch.hash);
			console.log("Match " + doesMatch.match ? "found" : "failed");
			if (!doesMatch.match) hashDismatch.push(lib);
			if (index == version_.libraries.length - 1) {
				resetScreen();
				(require("child_process"))
				.spawn("node index.js");
			}
		}, 500 * index);
	});
}
module.exports = validate;
