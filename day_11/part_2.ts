import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt"), 25), 55312);
	eq(await runWithFile(buildPath("./input.txt"), 75), 272673043446478);
})();

async function runWithFile(
	filePath: string,
	totalSteps: number,
): Promise<number> {
	const line = await readFile(filePath);

	const numbers = line.split(" ").map(Number);

	const startMap = new Map();
	for (let i = 0; i < numbers.length; i++) {
		const number = numbers[i];
		startMap.set(number, (startMap.get(number) || 0) + 1);
	}

	let stonesMap = startMap;
	for (let step = 0; step < totalSteps; step++) {
		stonesMap = createCountMap(stonesMap);
	}

	let result = 0;
	for (const [, count] of stonesMap) {
		result += count;
	}
	return result;
}

const createCountMap = (stonesMap: Map<number, number>) => {
	const ret = new Map();
	for (const [stoneValue, stoneCount] of stonesMap) {
		const newStones = makeStones(stoneValue);
		for (let i = 0; i < newStones.length; i++) {
			const newStone = newStones[i];
			const newCount = (ret.get(newStones[i]) || 0) + stoneCount;
			ret.set(newStone, newCount);
		}
	}
	return ret;
};

const makeStones = (number: number) => {
	if (number === 0) {
		return [1];
	}
	if (String(number).length % 2 === 0) {
		const sNumber = String(number);
		const sNumberLengthHalf = sNumber.length / 2;

		return [
			Number(sNumber.substring(0, sNumberLengthHalf)),
			Number(sNumber.substring(sNumberLengthHalf)),
		];
	}
	return [2024 * number];
};
