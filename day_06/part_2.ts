import path from "node:path";
import { assertEq, assertGreaterThan, assertLowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;
	const vectors = [
		[-1, 0],
		[-0, 1],
		[+1, 0],
		[-0, -1],
	];
	const obstacles: number[] = [];
	const sizeVertical = lines.length;
	const sizeHorizontal = lines[0].length;
	let start = [0, 0];
	for (let y = 0; y < sizeVertical; y++) {
		for (let x = 0; x < sizeHorizontal; x++) {
			const char = lines[y][x];
			if (char === "#") {
				obstacles.push(y * sizeHorizontal + x);
			}
			if (char === "^") {
				start = [y, x];
			}
		}
	}

	for (let y = 0; y < sizeVertical; y++) {
		for (let x = 0; x < sizeHorizontal; x++) {
			const o = y * sizeHorizontal + x
			if (obstacles.includes(o)) {
				continue;
			}
			const newObs = new Set(obstacles)
			newObs.add(o);

			if (countFields(
				start,
				vectors,
				newObs,
				sizeHorizontal,
				sizeVertical,
			)) {
				result++;
			}
		}
	}

	return result;
}

function countFields(init: number[], vectors: number[][], obstacles: Set<number>, sizeHorizontal: number, sizeVertical: number): boolean {
	let turns = 0
	let i = 0;
	let start = [init[0], init[1]];

	while (turns < 1000) {
		i++;
		const turnIndex = turns % vectors.length;
		const vec = vectors[turnIndex];
		const next = [start[0] + vec[0] * i, start[1] + vec[1] * i];
		const coord = next[0] * sizeHorizontal + next[1]
		if (next[0] < 0 || next[0] >= sizeVertical || next[1] < 0 || next[1] >= sizeHorizontal) {
			return false;
		}
		if (obstacles.has(coord)) {
			start = [start[0] + vec[0] * (i - 1), start[1] + vec[1] * (i - 1)];
			i = 0;
			turns++;
		}
	}
	return true;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}

(async () => {
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 6);
	assertEq(await runWithFile(buildPath("./input.txt")), 1909);
})();
