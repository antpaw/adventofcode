import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 1928);
	eq(await runWithFile(buildPath("./input.txt")), 6307275788409);
})();

async function runWithFile(filePath: string): Promise<number> {
	const chars = await readFile(filePath);

	let result = 0;

	const charsLength = chars.length;
	const layout: string[] = [];
	let id = 0;
	for (let i = 0; i < charsLength; i++) {
		const char = chars[i];
		const number = Number(char);

		if (i % 2 === 0) {
			for (let x = 0; x < number; x++) {
				layout.push(String(id));
			}
			id++;
		} else {
			for (let x = 0; x < number; x++) {
				layout.push(".");
			}
		}
	}

	const compressedLayout: string[] = [];
	let backIndex = layout.length;
	for (let frontIndex = 0; frontIndex < layout.length; frontIndex++) {
		const print = layout[frontIndex];
		if (print === ".") {
			while (true) {
				backIndex--;
				if (layout[backIndex] !== ".") {
					compressedLayout.push(layout[backIndex]);
					break;
				}
			}
		} else {
			compressedLayout.push(print);
		}

		if (backIndex - 1 === frontIndex) {
			break;
		}
	}

	for (let i = 0; i < compressedLayout.length; i++) {
		result += Number(i) * Number(compressedLayout[i]);
	}

	return result;
}
