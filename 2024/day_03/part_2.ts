import path from "node:path";
import { eq, greaterThan } from "../utils/assert.ts";
import { readFile } from "../utils/files.ts";

async function runWithFile(filePath: string): Promise<number> {
	const content = await readFile(filePath);
	const donts = content.split("don't()");
	const dos = [donts.shift()];
	donts.map((part) => {
		const a = part.split("do()");
		a.shift();
		dos.push(a.join(""));
	});
	return runMul(dos.join(""));
}

function runMul(content: string) {
	const mulStatements = content.split("mul(");
	let result = 0;
	for (let i = 0; i < mulStatements.length; i++) {
		const mulStatement = mulStatements[i];
		result += mul(mulStatement);
	}
	return result;
}

function mul(mulStatement: string) {
	const numbers = mulStatement.split(",");

	const x = Number.parseInt(numbers[0]);
	const y = Number.parseInt(numbers[1]);
	const rebuild = `${x},${y})`;

	if (!mulStatement.startsWith(rebuild)) {
		return 0;
	}
	if (x && y) {
		return x * y;
	}
	return 0;
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	eq(await runWithFile(buildPath("./input_simple_2.txt")), 48);
	greaterThan(await runWithFile(buildPath("./input.txt")), 51830478);
})();
