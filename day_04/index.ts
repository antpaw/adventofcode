import path from "node:path";
import { assertEq } from "../utils/assert.ts";
import { readFile } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const content = await readFile(filePath);

	return Number.parseInt(eval("3 + 5"));
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}

(async () => {
	assertEq(await runWithFile(buildPath("./input_simple.txt")), 161);
	// assertEq(await runWithFile(buildPath("./input.txt")), 169021493);
})();
