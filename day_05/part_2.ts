import path from "node:path";
import { assertEq, assertGreaterThan, assertLowerThan } from "../utils/assert.ts";
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

		if (!check(order, rules)) {
			const newOrder = reorderByCheck(order, rules);

			if (i % 10 === 0) {
				console.log("progress", i);
			}

			result += newOrder[Math.floor(newOrder.length / 2)];
		}
	}
	return result;
}

function reorderByCheck(order: number[], rules: string[]) {
	for (let orderI = 0; orderI < order.length; orderI++) {
		const orderNumber = order[orderI];

		for (let orderBeforeI = 0; orderBeforeI < orderI; orderBeforeI++) {
			const orderBeforeNumber = order[orderBeforeI];
			for (let rulesI = 0; rulesI < rules.length; rulesI++) {
				const [ruleNumber, beforeCheckNumber] = getRule(rules[rulesI]);
				if (
					orderNumber === ruleNumber &&
					orderBeforeNumber === beforeCheckNumber
				) {
					if (orderBeforeNumber < ruleNumber) {
						const o = [...order];
						o[orderI] = order[orderBeforeI];
						// o[orderBeforeI] = order[orderI];
						// o[orderI] = order[orderBeforeI];
						o.splice(orderI, 0, order[orderI]);
						o.splice(orderBeforeI, 1);
						return reorderByCheck(o, rules);
					}
				}
			}
		}
	}
	return order;
}

function check(order: number[], rules: string[]) {
	for (let orderI = 0; orderI < order.length; orderI++) {
		const orderNumber = order[orderI];

		for (let orderBeforeI = 0; orderBeforeI < orderI; orderBeforeI++) {
			const orderBeforeNumber = order[orderBeforeI];
			for (let rulesI = 0; rulesI < rules.length; rulesI++) {
				const [ruleNumber, beforeCheckNumber] = getRule(rules[rulesI]);
				if (
					orderNumber === ruleNumber &&
					orderBeforeNumber === beforeCheckNumber
				) {
					if (orderBeforeNumber < ruleNumber) {
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
		123,
	);
	assertLowerThan(
		assertGreaterThan(
			await runWithFile(buildPath("./input_a.txt"), buildPath("./input_b.txt")),
			6780,
		), 7280);
})();
