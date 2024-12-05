import path from "node:path";
import { assertEq, assertGreaterThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;

	for (let y = 0; y < lines.length; y++) {
		result++;
	}
	return result;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}

(async () => {
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 18);
	// assertGreaterThan(await runWithFile(buildPath("./input.txt")), 2350);
})();
