import path from "node:path";
import { assertEq, assertGreaterThan, assertLowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

const vectorsUp = [
	[-1, -1],
];
const vectorsDown = [
	[+1, +1],
];
async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;

	const sizeVertical = lines[0].length;
	const sizeHorizontal = lines.length;
	for (let i = 0; i < sizeHorizontal; i++) {
		for (let ii = 0; ii < sizeVertical; ii++) {
			const char = lines[i][ii];
			if (char === "M") {
				if (findAS(lines, i, ii, [1, 1], "A", "S")) {
					if (lines[i + 2]?.[ii] === 'S') {
						result += findAS(lines, i + 2, ii, [-1, 1], "A", "M") ? 1 : 0;
					}
					if (lines[i]?.[ii + 2] === 'S') {
						result += findAS(lines, i + 2, ii, [1, +1], "A", "M") ? 1 : 0;
					}
					if (lines[i - 2]?.[ii] === 'S') {
						result += findAS(lines, i + 2, ii, [-1, +1], "A", "M") ? 1 : 0;
					}
					if (lines[i]?.[ii - 2] === 'S') {
						result += findAS(lines, i + 2, ii, [1, -1], "A", "M") ? 1 : 0;
					}
				}
				if (findAS(lines, i, ii, [1, -1], "A", "S")) {
					if (lines[i + 2]?.[ii] === 'M') {
						result += findAS(lines, i + 2, ii, [-1, 1], 'A', 'S') ? 1 : 0;
					}
					if (lines[i + 2]?.[ii] === 'S') {
						result += findAS(lines, i + 2, ii, [-1, 1], 'A', 'M') ? 1 : 0;
					}
				}
			}
		}
	}
	return result;
}

function findAS(lines: string[], x: number, y: number, vector: number[], foo: string, bar: string) {
	if (lines[x + vector[0]]?.[y + vector[1]] === foo) {
		if (lines[x + vector[0] * 2]?.[y + vector[1] * 2] === bar) {
			return true;
		}
	}
	return false;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}

(async () => {
	assertEq(await runWithFile(buildPath("./input_simple_2.txt")), 9);
	assertLowerThan(await runWithFile(buildPath("./input.txt")), 2191);
})();
