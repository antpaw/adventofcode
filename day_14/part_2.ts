import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";
import { absModulo, compress, compressXY, decompress } from "../utils/grid.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	runWithFile(buildPath("./input.txt"), 101, 103);
})();

async function runWithFile(
	filePath: string,
	sizeX: number,
	sizeY: number,
): Promise<number> {
	const lines = await readLines(filePath);

	const draw = (all: Set<number>) => {
		for (let x = 0; x < sizeX; x++) {
			let line = "";
			for (let y = 0; y < sizeY; y++) {
				line += all.has(compressXY(y, x, sizeX)) ? "#" : ".";
			}
			console.log(line);
		}
	};

	const all: Set<number> = new Set();
	steps: for (let step = 0; step < 10000; step++) {
		for (let i = 0; i < lines.length; i++) {
			const robotLine = lines[i].split(" ");

			const robotP = robotLine[0].split("=")[1].split(",").map(Number);
			const robotV = robotLine[1].split("=")[1].split(",").map(Number);

			const a = absModulo(robotV[0] * step + robotP[0], sizeX);
			const b = absModulo(robotV[1] * step + robotP[1], sizeY);
			const c = compressXY(a, b, sizeX);
			if (all.has(c)) {
				all.clear();
				continue steps;
			}
			all.add(c);
		}
		console.log("----");
		console.log(step);

		draw(all);
	}

	return 1;
}
