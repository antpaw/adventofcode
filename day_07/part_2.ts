import path from "node:path";
import {
	assertEq,
	assertGreaterThan,
	assertLowerThan,
} from "../utils/assert.ts";
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
	for (const combosSecond of combos) {
		for (const combo of combosSecond) {
			if (evaluateLeftToRight(numbers, combo) === result) {
				return true;
			}
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
		} else if (op === "*") {
			value = value * nextNum;
		} else if (op === "||") {
			value = Number(String(value) + String(nextNum));
		}
	}
	return value;
}

function allOperatorCombos(length: number) {
	const combos: string[][][] = [];
	const total = 1 << length;
	for (let mask = 0; mask < total; mask++) {
		const combosSecond: string[][] = [];
		for (let maskSecond = 0; maskSecond < total; maskSecond++) {
			const combo: string[] = [];
			for (let i = 0; i < length; i++) {
				if (maskSecond & (1 << i)) {
					combo.push("||");
				} else {
					combo.push(mask & (1 << i) ? "*" : "+");
				}
			}
			combosSecond.push(combo);
		}
		combos.push(combosSecond);
	}
	return combos;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	// assertEq(await runWithFile(buildPath("./input_simple.txt")), 11387);
	assertEq(await runWithFile(buildPath("./input.txt")), 248427118972289);
})();
