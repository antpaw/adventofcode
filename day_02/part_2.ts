import path from "node:path";
import { assertEq, assertLowerThan } from "../utils/assert.ts";
import { readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);
	let result = 0;
	for (let index = 0; index < lines.length; index++) {
		const numbers = lines[index].split(" ");

		if (check(numbers)) {
			result++;
		} else {
			for (let i = 0; i < numbers.length; i++) {
				const newNumbers = [...numbers];
				newNumbers.splice(i, 1);
				if (check(newNumbers)) {
					result++;
					break;
				}
			}
		}
	}
	return result;
}

function check(numbers) {
	for (let i = 1; i < numbers.length - 1; i++) {
		const a = Number.parseInt(numbers[i - 1], 10);
		const b = Number.parseInt(numbers[i], 10);
		const c = Number.parseInt(numbers[i + 1], 10);

		const xB = a - b;
		const xF = b - c;
		const dirB = getDir(xB);
		const dirF = getDir(xF);

		if (
			dirB === dirF &&
			Math.abs(xB) > 0 &&
			Math.abs(xF) > 0 &&
			Math.abs(xB) < 4 &&
			Math.abs(xF) < 4
		) {
			continue;
		}
		return false;
	}
	return true;
}

function getDir(x) {
	if (x === 0) {
		return 0;
	}
	return x > 0 ? 1 : -1;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	assertEq(await runWithFile(buildPath("./input.txt")), 514);
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 4);
})();
