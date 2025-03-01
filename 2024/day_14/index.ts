import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";
import { absModulo, compress, compressXY, decompress } from "../utils/grid.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt"), 11, 7), 12);
	eq(await runWithFile(buildPath("./input.txt"), 101, 103), 219512160);
})();

async function runWithFile(
	filePath: string,
	sizeX: number,
	sizeY: number,
): Promise<number> {
	const lines = await readLines(filePath);
	const sec = 100;

	const xq = Math.floor(sizeX / 2);
	const yq = Math.floor(sizeY / 2);

	const quads = [0, 0, 0, 0];
	for (let i = 0; i < lines.length; i++) {
		const robotLine = lines[i].split(" ");

		const robotP = robotLine[0].split("=")[1].split(",").map(Number);
		const robotV = robotLine[1].split("=")[1].split(",").map(Number);

		const a = absModulo(robotV[0] * sec + robotP[0], sizeX);
		const b = absModulo(robotV[1] * sec + robotP[1], sizeY);
		if (a < xq && b < yq) {
			quads[0]++;
		}
		if (a > xq && b < yq) {
			quads[1]++;
		}
		if (a < xq && b > yq) {
			quads[2]++;
		}
		if (a > xq && b > yq) {
			quads[3]++;
		}
	}

	return quads.reduce((acc, v) => acc * v, 1);
}
