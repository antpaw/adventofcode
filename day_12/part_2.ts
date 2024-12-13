import { dir } from "node:console";
import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";
import {
	compress,
	compressTwoPoints,
	compressXY,
	decompress,
	decompressTwoPoints,
} from "../utils/grid.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 1206);
	eq(await runWithFile(buildPath("./input_simple_2.txt")), 236);
	eq(await runWithFile(buildPath("./input_simple_3.txt")), 368);
	eq(await runWithFile(buildPath("./input.txt")), 870202);
})();

const vectors = [
	[-1, 0],
	[-0, 1],
	[+1, 0],
	[-0, -1],
];

const vectorRightAndDown = [
	[1, 0],
	[0, 1],
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

	const allPermitter = new Map<string, Set<number>[]>();

	for (const [char, charAreas] of allAreas) {
		for (const area of charAreas) {
			const permitter: Set<number> = new Set();
			for (const coord of area) {
				const point = decompress(coord, sizeX);
				for (const vec of vectors) {
					const nextPoint = [point[0] + vec[0], point[1] + vec[1]];
					const nextChar = grid[nextPoint[0]]?.[nextPoint[1]];
					if (nextChar !== char) {
						permitter.add(compressTwoPoints(point, nextPoint, sizeX));
					}
				}
			}

			const directions = new Set<number>();
			for (const doubleCoord of permitter) {
				let add = true;
				const [a, b] = decompressTwoPoints(doubleCoord, sizeX);
				for (const vec of vectorRightAndDown) {
					const aa = [vec[0] + a[0], vec[1] + a[1]];
					const bb = [vec[0] + b[0], vec[1] + b[1]];

					const xx = compressTwoPoints(aa, bb, sizeX);
					if (permitter.has(xx)) {
						add = false;
					}
				}
				if (add) {
					directions.add(doubleCoord);
				}
			}
			if (!allPermitter.has(char)) {
				allPermitter.set(char, []);
			}
			allPermitter.get(char)?.push(directions);
		}
	}

	let result = 0;

	for (const [char, charAreas] of allAreas) {
		const allDirections = allPermitter.get(char);

		if (!allDirections) {
			console.log("No permitter for", char);
			continue;
		}

		for (let i = 0; i < charAreas.length; i++) {
			const area = charAreas[i];
			const permitter = allDirections[i];

			result += area.size * permitter.size;
		}
	}

	return result;
}
