import path from "node:path";
import { assertEq, assertGreaterThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;

	const sizeVertical = lines[0].length;
	const sizeHorizontal = lines.length;
	for (let i = 0; i < sizeHorizontal; i++) {
		for (let ii = 0; ii < sizeVertical; ii++) {
			const char = lines[i][ii];
			if (char === "X") {
				result += findMAS(lines, i, ii);
			}
		}
	}
	return result;
}

function findMAS(lines: string[], x: number, y: number) {
	const vectors = [
		[-1, -1], [-1, 0], [-1, 1],
		[-0, -1], /*     */[-0, 1],
		[+1, -1], [+1, 0], [+1, 1],
	];

	let result = 0;
	for (let index = 0; index < vectors.length; index++) {
		const vector = vectors[index];
		if (lines[x + vector[0]]?.[y + vector[1]] === 'M') {
			if (lines[x + vector[0] * 2]?.[y + vector[1] * 2] === 'A') {
				if (lines[x + vector[0] * 3]?.[y + vector[1] * 3] === 'S') {
					result++;
				}
			}
		}
	}
	return result;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}

(async () => {
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 18);
	assertGreaterThan(await runWithFile(buildPath("./input.txt")), 2350);
})();
