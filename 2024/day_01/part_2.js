import fs from "node:fs";
import path from "node:path";

const filePath = path.join(__dirname, "../day_01/input.txt");

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

	const result = aArr.reduce((acc, curr) => {
		return (
			acc +
			curr *
				bArr
					.map((b) => {
						if (curr === b) {
							return 1;
						}
						return 0;
					})
					.reduce((acc2, curr2) => {
						return acc2 + curr2;
					}, 0)
		);
	}, 0);

	console.log("Result:", result);
});
