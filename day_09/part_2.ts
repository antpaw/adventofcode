import path from "node:path";
import { eq, eqString, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 2858);
	eq(await runWithFile(buildPath("./input.txt")), 6327174563252);
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

	const filesMap = buildFilesMap(layout);
	const compressedLayout = compress(layout, filesMap);

	for (let i = 0; i < compressedLayout.length; i++) {
		if (compressedLayout[i] === ".") {
			continue;
		}
		result += Number(i) * Number(compressedLayout[i]);
	}

	return result;
}

function compress(originalLayout: string[], data: FileSizes) {
	const layout = [...originalLayout];
	const layoutLength = layout.length;
	for (let i = 0; i < layoutLength; i++) {
		const print = originalLayout[i];

		if (print === ".") {
			let spaceAvailable = 0;
			while (true) {
				spaceAvailable++;
				if (originalLayout[i + spaceAvailable] !== ".") {
					break;
				}
			}

			const [fileId, fileSize, fileIndex] = findNextBestFit(
				data,
				spaceAvailable,
				i,
			);

			if (fileId !== undefined) {
				for (let ii = 0; ii < fileSize; ii++) {
					layout[fileIndex + ii] = ".";
				}
				for (let ii = 0; ii < fileSize; ii++) {
					layout[i + ii] = String(fileId);
				}
				i += fileSize - 1;
			}
		}
	}
	return layout;
}

function findNextBestFit(
	filesMap: FileSizes,
	spaceAvailable: number,
	cursor: number,
): [number | undefined, number, number] {
	for (let fileId = 11_000; fileId > 0; fileId--) {
		const file = filesMap.get(fileId);
		if (
			file !== undefined &&
			file.size <= spaceAvailable &&
			cursor < file.index
		) {
			filesMap.delete(fileId);
			return [fileId, file.size, file.index];
		}
	}

	return [undefined, 0, 0];
}

function buildFilesMap(layout: string[]): FileSizes {
	const layoutLength = layout.length;
	const ret: FileSizes = new Map();

	let spaceUsed = 0;
	let print: string = layout[0];
	for (let i = 0; i < layoutLength; i++) {
		spaceUsed++;
		if (layout[i + 1] !== print) {
			const fileId = Number(print);
			if (print !== "." && ret.get(fileId) === undefined) {
				ret.set(fileId, {
					index: i - spaceUsed + 1,
					size: spaceUsed,
				});
			}
			spaceUsed = 0;
			print = layout[i + 1];
		}
	}

	return ret;
}

type File = {
	index: number;
	size: number;
};

type FileSizes = Map<number, File>;
