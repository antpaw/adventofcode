import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), -1);
	// greaterThan(await runWithFile(buildPath("./input.txt")), -1);
})();

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;

	for (let y = 0; y < lines.length; y++) {
		result++;
	}
	return result;
}
