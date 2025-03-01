import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const lines = await readLines(filePath);

	let sum = 0;

	for (let y = 0; y < lines.length; y++) {
		const line = lines[y];
		const parts = line.split(":");
		const result = Number.parseInt(parts[0]);
		const numbers = parts[1].split(" ").map(Number);

		if (canMatchResult(result, numbers)) {
			sum += result;
		}
	}
	return sum;
}

function canMatchResult(result: number, numbers: number[]) {
	const combos = allOperatorCombos(numbers.length - 1);
	for (const combo of combos) {
		if (evaluateLeftToRight(numbers, combo) === result) {
			return true;
		}
	}
	return false;
}

function evaluateLeftToRight(numbers: number[], operators: string[]) {
	let value = numbers[0];
	for (let i = 0; i < operators.length; i++) {
		const op = operators[i];
		const nextNum = numbers[i + 1];
		if (op === "+") {
			value = value + nextNum;
		} else {
			value = value * nextNum;
		}
	}
	return value;
}

function allOperatorCombos(length: number) {
	const combos: string[][] = [];
	const total = 1 << length;
	for (let mask = 0; mask < total; mask++) {
		const combo: string[] = [];
		for (let i = 0; i < length; i++) {
			combo.push(mask & (1 << i) ? "*" : "+");
		}
		combos.push(combo);
	}
	return combos;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	eq(await runWithFile(buildPath("./input_simple.txt")), 3749);
	eq(await runWithFile(buildPath("./input.txt")), 1298300076754);
})();
