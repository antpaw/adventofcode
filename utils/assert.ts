export function greaterThan(a: number, b: number) {
	if (a > b) {
		console.log(
			"%cAssertion passed",
			"color: blue; font-weight: bold;",
			a,
			">",
			b,
		);
	} else {
		console.error(
			"%cAssertion failed:",
			"color: red; font-weight: bold;",
			a,
			">",
			b,
		);
	}
	return a;
}

export function lowerThan(a: number, b: number) {
	if (a < b) {
		console.log(
			"%cAssertion passed",
			"color: blue; font-weight: bold;",
			a,
			"<",
			b,
		);
	} else {
		console.error(
			"%cAssertion failed:",
			"color: red; font-weight: bold;",
			a,
			"<",
			b,
		);
	}
	return a;
}

export function eq(a: number, b: number): number {
	if (a === b) {
		console.log("%cAssertion passed", "color: green; font-weight: bold;", a);
	} else {
		console.error(
			"%cAssertion failed:",
			"color: red; font-weight: bold;",
			a,
			"!==",
			b,
		);
	}
	return a;
}
