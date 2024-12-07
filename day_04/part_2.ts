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

	const sizeVertical = lines[0].length;
	const sizeHorizontal = lines.length;
	for (let y = 0; y < sizeHorizontal; y++) {
		for (let x = 0; x < sizeVertical; x++) {
			if (findAS(lines, y, x, [1, 1], "M", "A", "S")) {
				if (findAS(lines, y + 2, x, [-1, 1], "M", "A", "S")) {
					result++;
				}
				if (findAS(lines, y + 2, x, [-1, 1], "S", "A", "M")) {
					result++;
				}
			}
			if (findAS(lines, y, x, [1, 1], "S", "A", "M")) {
				if (findAS(lines, y + 2, x, [-1, 1], "M", "A", "S")) {
					result++;
				}
				if (findAS(lines, y + 2, x, [-1, 1], "S", "A", "M")) {
					result++;
				}
			}
		}
	}

	return result;
}

function findAS(
	lines: string[],
	x: number,
	y: number,
	vector: number[],
	zoo: string,
	foo: string,
	bar: string,
) {
	return (
		lines[x]?.[y] === zoo &&
		lines[x + vector[0]]?.[y + vector[1]] === foo &&
		lines[x + vector[0] * 2]?.[y + vector[1] * 2] === bar
	);
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	assertEq(await runWithFile(buildPath("./input_simple_2.txt")), 9);
	assertLowerThan(await runWithFile(buildPath("./input.txt")), 2191);
})();
