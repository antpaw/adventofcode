import path from "node:path";
import {
	assertEq,
	assertGreaterThan,
	assertLowerThan,
} from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let result = 0;
	const turns = 0;
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
				obstacles.push(y * sizeVertical + x);
			}
			if (char === "^") {
				start = [y, x];
			}
		}
	}

	result = countFields(
		start,
		vectors,
		obstacles,
		sizeHorizontal,
		sizeVertical,
	).size;
	return result + 1;
}

function countFields(
	init: number[],
	vectors: number[][],
	obstacles: number[],
	sizeHorizontal: number,
	sizeVertical: number,
): Set<number> {
	const steps = new Set<number>();
	let turns = 0;
	let i = 0;
	let start = [init[0], init[1]];
	while (true) {
		i++;
		const vec = vectors[turns % vectors.length];
		const next = [start[0] + vec[0] * i, start[1] + vec[1] * i];
		const coord = next[0] * sizeVertical + next[1];
		if (
			next[0] < 0 ||
			next[0] >= sizeVertical ||
			next[1] < 0 ||
			next[1] >= sizeHorizontal
		) {
			return steps;
		}
		if (obstacles.includes(coord)) {
			start = [start[0] + vec[0] * (i - 1), start[1] + vec[1] * (i - 1)];
			i = 0;
			turns++;
		} else {
			steps.add(coord);
		}
	}
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 41);
	assertLowerThan(
		assertGreaterThan(await runWithFile(buildPath("./input.txt")), 5161),
		5315,
	);
})();
