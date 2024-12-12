import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 1930);
	// greaterThan(await runWithFile(buildPath("./input.txt")), -1);
})();
const vectors = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[-0, -1],
	/*     */
	[-0, 1],
	[+1, -1],
	[+1, 0],
	[+1, 1],
];

async function runWithFile(filePath: string): Promise<number> {
	const grid = await readLines(filePath);
	const sizeX = grid.length;
	const sizeY = grid[0].length;

	const collected = new Set<number>();
	function findAllAdjacent(x: number, y: number, char: string, i: number) {
		for (const vec of vectors) {
			const next = grid[x + vec[0] * i]?.[y + vec[1] * i];
			const coord = x * sizeX + y;
			if (collected.has()) {
				return;
			}
			if (char === next) {
			}
			collected.add(coord);
		}
	}
	let result = 0;

	for (let x = 0; x < sizeX; x++) {
		const line = grid[x];
		for (let y = 0; y < sizeY; y++) {
			const char = line[y];
			findAllAdjacent(x, y, char);
		}
		result++;
	}
	return result;
}
