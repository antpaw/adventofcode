import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";
import { compress, compressXY, decompress } from "../utils/grid.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 1930);
	eq(await runWithFile(buildPath("./input.txt")), 1424472);
})();

const vectors = [
	[-1, 0],
	[-0, 1],
	[+1, 0],
	[-0, -1],
];

async function runWithFile(filePath: string): Promise<number> {
	const grid = await readLines(filePath);
	const sizeX = grid.length;
	const sizeY = grid[0].length;

	const plain = new Set<number>();
	function findAllAdjacent(
		x: number,
		y: number,
		char: string,
		area: Set<number>,
	) {
		for (const vec of vectors) {
			const nextXY = [x + vec[0], y + vec[1]];
			const next = grid[nextXY[0]]?.[nextXY[1]];
			const coord = compress(nextXY, sizeX);
			if (area.has(coord)) {
				continue;
			}
			if (char === next) {
				area.add(coord);
				plain.add(coord);
				findAllAdjacent(nextXY[0], nextXY[1], char, area);
			}
		}
		return area;
	}

	const allAreas = new Map<string, Set<number>[]>();
	for (let x = 0; x < sizeX; x++) {
		const line = grid[x];
		for (let y = 0; y < sizeY; y++) {
			const char = line[y];
			const originCoord = compressXY(x, y, sizeX);
			if (plain.has(originCoord)) {
				continue;
			}
			if (!allAreas.has(char)) {
				allAreas.set(char, []);
			}
			allAreas
				.get(char)
				?.push(findAllAdjacent(x, y, char, new Set<number>([originCoord])));
		}
	}

	const allPermitter = new Map<string, number[][]>();
	for (const [char, charAreas] of allAreas) {
		for (const area of charAreas) {
			const extendedArea: number[] = [];
			for (const coord of area) {
				const [x, y] = decompress(coord, sizeX);
				for (const vec of vectors) {
					const nextXY = [x + vec[0], y + vec[1]];
					const nextChar = grid[nextXY[0]]?.[nextXY[1]];
					if (nextChar !== char) {
						extendedArea.push(compress(nextXY, sizeX));
					}
				}
			}
			if (!allPermitter.has(char)) {
				allPermitter.set(char, []);
			}
			allPermitter.get(char)?.push(extendedArea);
		}
	}

	let result = 0;

	for (const [char, charAreas] of allAreas) {
		const charAllPermitter = allPermitter.get(char);

		if (!charAllPermitter) {
			console.log("No permitter for", char);
			continue;
		}
		for (let i = 0; i < charAreas.length; i++) {
			const area = charAreas[i];
			const permitter = charAllPermitter[i];

			result += area.size * permitter.length;
		}
	}

	return result;
}
