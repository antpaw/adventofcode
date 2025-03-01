import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 81);
	eq(await runWithFile(buildPath("./input.txt")), 1366);
})();

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	const grid: number[][] = [];
	const sizeVertical = lines.length;
	const sizeHorizontal = lines[0].length;

	let result = 0;
	for (let y = 0; y < sizeVertical; y++) {
		const line = lines[y];
		grid[y] = [];
		for (let x = 0; x < sizeHorizontal; x++) {
			grid[y][x] = Number(line[x]);
		}
	}

	const vectors = [
		[-1, 0],
		[-0, 1],
		[+1, 0],
		[-0, -1],
	];
	const findAdjacentPeaks = (coords: number[][], height: number) => {
		const valid: number[][] = [];
		let ret = 0;
		for (let i = 0; i < coords.length; i++) {
			const [x, y] = coords[i];
			for (const [dx, dy] of vectors) {
				const nx = x + dx * 1;
				const ny = y + dy * 1;
				const nextPoint = grid[ny]?.[nx];
				if (nextPoint === height) {
					valid.push([nx, ny]);
					if (height === 9) {
						ret++;
					}
				}
			}
		}
		if (height === 9) {
			return ret;
		}
		if (valid.length) {
			return findAdjacentPeaks(valid, height + 1);
		}
		return 0;
	};

	for (let y = 0; y < sizeVertical; y++) {
		const coordsLine = grid[y];
		for (let x = 0; x < sizeHorizontal; x++) {
			const point = coordsLine[x];
			if (point !== 0) {
				continue;
			}

			result += findAdjacentPeaks([[x, y]], 1);
		}
	}
	return result;
}
