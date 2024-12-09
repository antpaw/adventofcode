import path from "node:path";
import { eq, eqString, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 2858);
	// greaterThan(await runWithFile(buildPath("./input.txt")), 1928);
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

	const compressedLayout: string[] = compress(layout, false);
	eqString(
		compressedLayout.join(""),
		"0099.111777244.33388885555.6666...........",
	);
	console.log(layout.join(""));
	console.log(compressedLayout.join(""));

	for (let i = 0; i < compressedLayout.length; i++) {
		if (compressedLayout[i] === ".") {
			continue;
		}
		result += Number(i) * Number(compressedLayout[i]);
	}

	return result;
}

function compress(originLayout: string[], debug = false) {
	const compressedLayout: string[] = [];
	const layout = [...originLayout];
	const layoutLength = layout.length;
	let frontIndex = 0;
	while (frontIndex < layoutLength) {
		const print = layout[frontIndex];

		if (print === ".") {
			let dotSpace = 1;
			while (true) {
				if (layout[frontIndex + dotSpace] !== ".") {
					break;
				}
				dotSpace++;
			}
			const [foundNumber, dotsNeeded, backIndex] = findNextBestFit(
				frontIndex,
				layout,
				layoutLength,
				dotSpace,
			);

			if (foundNumber !== undefined) {
				if (debug)
					console.log(foundNumber, dotsNeeded, dotSpace, backIndex, frontIndex);

				for (let i = 0; i < dotsNeeded; i++) {
					layout[backIndex + i] = ".";
				}

				for (let i = 0; i < dotSpace; i++) {
					if (i < dotsNeeded) {
						compressedLayout.push(foundNumber);
					} else {
						compressedLayout.push(".");
					}
				}
				frontIndex += dotSpace;
				continue;
			}
		}

		compressedLayout.push(print);
		frontIndex++;
	}
	return compressedLayout;
}

function findNextBestFit(
	startIndex: number,
	layout: string[],
	layoutLength: number,
	spaceAvailable: number,
): [string | undefined, number, number] {
	const reverseLayout = [...layout];
	reverseLayout.reverse();

	let dotsNeeded = 0;
	let ignoreNumber: string | undefined = undefined;
	let foundNumber: string | undefined = undefined;
	for (let i = 0; i < layoutLength - startIndex; i++) {
		const print = reverseLayout[i];
		if (print !== "." && print !== ignoreNumber) {
			dotsNeeded++;
			if (foundNumber === undefined) {
				foundNumber = print;
			}
		}
		if (print === foundNumber) {
			if (dotsNeeded <= spaceAvailable) {
				if (reverseLayout[i + 1] !== foundNumber) {
					return [foundNumber, dotsNeeded, layoutLength - i - 1];
				}
			} else {
				ignoreNumber = foundNumber;
				dotsNeeded = 0;
				foundNumber = undefined;
			}
		}
	}

	return [undefined, 0, 0];
}
