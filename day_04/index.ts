import path from "node:path";
import { eq, greaterThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;

	const sizeVertical = lines[0].length;
	const sizeHorizontal = lines.length;
	for (let y = 0; y < sizeHorizontal; y++) {
		for (let x = 0; x < sizeVertical; x++) {
			const char = lines[y][x];
			if (char === "X") {
				result += findMAS(lines, y, x);
			}
		}
	}
	return result;
}

function findMAS(lines: string[], y: number, x: number) {
	const vectors = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[-0, -1],
		/*     */ [-0, 1],
		[+1, -1],
		[+1, 0],
		[+1, 1],
	];

	let result = 0;
	for (let index = 0; index < vectors.length; index++) {
		const vector = vectors[index];
		if (lines[y + vector[0]]?.[x + vector[1]] === "M") {
			if (lines[y + vector[0] * 2]?.[x + vector[1] * 2] === "A") {
				if (lines[y + vector[0] * 3]?.[x + vector[1] * 3] === "S") {
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
	eq(await runWithFile(buildPath("./input_simple.txt")), 18);
	greaterThan(await runWithFile(buildPath("./input.txt")), 2350);
})();
