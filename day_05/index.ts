import path from "node:path";
import { assertEq, assertGreaterThan } from "../utils/assert.ts";
import { readFile, readLines } from "../utils/files.ts";

async function runWithFile(
	filePathA: string,
	filePathB: string,
): Promise<number> {
	const rules = await readLines(filePathA);
	const orders = await readLines(filePathB);

	let result = 0;

	for (let i = 0; i < orders.length; i++) {
		const order = orders[i].split(",").map(Number);

		if (check(order, rules)) {
			result += order[Math.floor(order.length / 2)];
		}
	}
	return result;
}

function check(order: number[], rules: string[]) {
	for (let orderI = 0; orderI < order.length; orderI++) {
		const orderNumber = order[orderI];

		for (
			let orderAfterI = orderI + 1;
			orderAfterI < order.length;
			orderAfterI++
		) {
			const orderAfterNumber = order[orderAfterI];

			for (let rulesI = 0; rulesI < rules.length; rulesI++) {
				const [ruleNumber, beforeCheckNumber] = getRule(rules[rulesI]);
				if (
					orderNumber === beforeCheckNumber &&
					orderAfterNumber === ruleNumber
				) {
					if (ruleNumber < beforeCheckNumber) {
						return false;
					}
				}
			}
		}

		for (let orderBeforeI = 0; orderBeforeI < orderI; orderBeforeI++) {
			const orderBeforeNumber = order[orderBeforeI];
			for (let rulesI = 0; rulesI < rules.length; rulesI++) {
				const [ruleNumber, beforeCheckNumber] = getRule(rules[rulesI]);
				if (
					orderNumber === ruleNumber &&
					orderBeforeNumber === beforeCheckNumber
				) {
					if (orderBeforeNumber < ruleNumber) {
						// console.log("b", orderNumber, beforeCheckNumber, rules[rulesI]);
						return false;
					}
				}
			}
		}
	}
	return true;
}

function getRule(rule: string) {
	return rule.split("|").map(Number);
}

function buildPath(filePath: string): string {
	return path.join(import.meta.dirname, filePath);
}
(async () => {
	assertEq(
		await runWithFile(
			buildPath("./input_simple_a.txt"),
			buildPath("./input_simple_b.txt"),
		),
		143,
	);
	assertEq(
		await runWithFile(buildPath("./input_a.txt"), buildPath("./input_b.txt")),
		4957,
	);
})();
