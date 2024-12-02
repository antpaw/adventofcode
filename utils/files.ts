import fs from "node:fs/promises";
import path from "node:path";

export async function readLines(filePath: string): Promise<string[]> {
	const data = await readFile(filePath);
	const lines = data.split("\n");
	return lines;
}

export async function readFile(filePath: string): Promise<string> {
	return await fs.readFile(filePath, "utf8")
}
