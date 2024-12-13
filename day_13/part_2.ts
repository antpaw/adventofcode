import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 875318608908);
	eq(await runWithFile(buildPath("./input.txt")), 89013607072065);
})();

const mega = 10000000000000;
const splitButton = (line: string): [number, number] => {
	const buttonA = line.split(":")[1].split(", ");

	return [
		Number(buttonA[0].replace("X", "")),
		Number(buttonA[1].replace("Y", "")),
	];
};

async function runWithFile(filePath: string): Promise<number> {
	const file = await readFile(filePath);

	const machines = file.split("\n\n").map((content) => {
		const lines = content.split("\n");
		const buttonA = splitButton(lines[0]);
		const buttonB = splitButton(lines[1]);
		const prize = lines[2].split(": ")[1].split(", ");

		return new Machine(
			new Button(buttonA[0], buttonA[1], 3),
			new Button(buttonB[0], buttonB[1], 1),
			[
				Number(prize[0].replace("X=", "")) + mega,
				Number(prize[1].replace("Y=", "")) + mega,
			],
		);
	});

	let result = 0;

	for (const m of machines) {
		const a_1 = m.prize[0] * m.buttonB.y - m.prize[1] * m.buttonB.x;
		const a_2 = m.buttonA.x * m.buttonB.y - m.buttonA.y * m.buttonB.x;
		const a = Math.floor(a_1 / a_2);
		const b = Math.floor((m.prize[0] - m.buttonA.x * a) / m.buttonB.x);

		const x = m.buttonA.x * a + m.buttonB.x * b;
		const y = m.buttonA.y * a + m.buttonB.y * b;

		if (x === m.prize[0] && y === m.prize[1]) {
			result += a * m.buttonA.cost + b * m.buttonB.cost;
		}
	}

	return result;
}

class Button {
	constructor(
		public x: number,
		public y: number,
		public cost: number,
	) {}
}
class Machine {
	constructor(
		public buttonA: Button,
		public buttonB: Button,
		public prize: [number, number],
	) {}
}
