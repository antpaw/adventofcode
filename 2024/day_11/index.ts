import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 55312);
	eq(await runWithFile(buildPath("./input.txt")), 229043);
})();

async function runWithFile(filePath: string): Promise<number> {
	const line = await readFile(filePath);

	const numbers = line.split(" ").map(Number);

	const makeStep = (input: number[]) => {
		const ret: number[] = [];
		for (let i = 0; i < input.length; i++) {
			const number = input[i];

			if (number === 0) {
				ret.push(1);
			} else if (String(number).length % 2 === 0) {
				const sNumber = String(number);
				const sNumberLengthHalf = sNumber.length / 2;

				ret.push(Number(sNumber.substring(0, sNumberLengthHalf)));
				ret.push(Number(sNumber.substring(sNumberLengthHalf)));
			} else {
				ret.push(2024 * number);
			}
		}
		return ret;
	};

	let a = numbers;

	for (let i = 0; i < 25; i++) {
		a = makeStep(a);
	}
	return a.length;
}
