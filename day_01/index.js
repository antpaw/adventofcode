import fs from "node:fs";
import path from "node:path";

const filePath = path.join(__dirname, "input.txt");

fs.readFile(filePath, "utf8", (err, data) => {
	if (err) {
		console.error("Error reading the file:", err);
		return;
	}
	const lines = data.split("\n");
	const aArr = [];
	const bArr = [];
	for (let index = 0; index < lines.length; index++) {
		const [a, b] = lines[index].split("   ");
		if (a === undefined || b === undefined) {
			continue;
		}
		aArr.push(Number.parseInt(a, 10));
		bArr.push(Number.parseInt(b, 10));
	}
	aArr.sort((a, b) => a - b);
	bArr.sort((a, b) => a - b);

	console.log("Sorted aArr:", aArr);
	console.log("Sorted bArr:", bArr);

	const result = aArr.reduce((acc, curr, i) => {
		return acc + Math.abs(curr - bArr[i]);
	}, 0);

	console.log("Result:", result);
});
