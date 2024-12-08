import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 34);
	eq(await runWithFile(buildPath("./input.txt")), 1231);
})();

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	const sizeVertical = lines.length;
	const sizeHorizontal = lines[0].length;
	const antennas: Map<string, [number, number][]> = new Map();
	for (let y = 0; y < sizeVertical; y++) {
		for (let x = 0; x < sizeHorizontal; x++) {
			const point = lines[y][x];
			if (point === ".") {
				continue;
			}
			if (antennas.has(point)) {
				antennas.get(point)?.push([x, y]);
			} else {
				antennas.set(point, [[x, y]]);
			}
		}
	}

	const antiNodes = new Set<number>();
	for (const [, coords] of antennas) {
		for (let outer = 0; outer < coords.length - 1; outer++) {
			const [x1, y1] = coords[outer];
			for (let inner = 0; inner < coords.length - 1; inner++) {
				const [x2, y2] = coords[inner + 1];

				if (x1 === x2 && y1 === y2) {
					continue;
				}

				const distanceX = x1 - x2;
				const distanceY = y1 - y2;
				for (let steps = 0; steps < 100; steps++) {
					const coord1 = [x1 + distanceX * steps, y1 + distanceY * steps];
					if (
						!(
							coord1[0] < 0 ||
							coord1[0] >= sizeHorizontal ||
							coord1[1] < 0 ||
							coord1[1] >= sizeVertical
						)
					) {
						antiNodes.add(coord1[1] * sizeVertical + coord1[0]);
					}
					const coord2 = [x2 - distanceX * steps, y2 - distanceY * steps];
					if (
						!(
							coord2[0] < 0 ||
							coord2[0] >= sizeHorizontal ||
							coord2[1] < 0 ||
							coord2[1] >= sizeVertical
						)
					) {
						antiNodes.add(coord2[1] * sizeVertical + coord2[0]);
					}
				}
			}
		}
	}

	return antiNodes.size;
}
