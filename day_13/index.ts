import path from "node:path";
import { eq, greaterThan, lowerThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

(async () => {
	const buildPath = (f: string) => path.join(import.meta.dirname, f);

	eq(await runWithFile(buildPath("./input_simple.txt")), 480);
	eq(await runWithFile(buildPath("./input.txt")), 32026);
})();

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
			[Number(prize[0].replace("X=", "")), Number(prize[1].replace("Y=", ""))],
		);
	});

	let result = 0;

	for (const machine of machines) {
		main: for (let a = 0; a < machine.maxSteps; a++) {
			for (let b = machine.maxSteps; b >= 0; b--) {
				const x = machine.buttonA.x * a + machine.buttonB.x * b;
				const y = machine.buttonA.y * a + machine.buttonB.y * b;

				if (x === machine.prize[0] && y === machine.prize[1]) {
					result += a * machine.buttonA.cost + b * machine.buttonB.cost;
					break main;
				}
			}
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

	multiplyCost(multiplier: number) {
		return [this.x * multiplier, this.y * multiplier, this.cost * multiplier];
	}
}
class Machine {
	readonly maxSteps: number;
	readonly minSteps: number;
	constructor(
		public buttonA: Button,
		public buttonB: Button,
		public prize: [number, number],
	) {
		let x = Math.ceil(Math.max(prize[0] / buttonA.x, prize[0] / buttonB.x));
		let y = Math.ceil(Math.max(prize[1] / buttonA.y, prize[1] / buttonB.y));
		this.maxSteps = Math.max(x, y);

		x = Math.ceil(Math.min(prize[0] / buttonA.x, prize[0] / buttonB.x));
		y = Math.ceil(Math.min(prize[1] / buttonA.y, prize[1] / buttonB.y));
		this.minSteps = Math.min(x, y);
	}
}
