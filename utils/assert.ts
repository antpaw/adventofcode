export function assertGreaterThan(a: number, b: number) {
	if (a > b) {
		console.log("%cAssertion passed", "color: green; font-weight: bold;", a, ">", b)
		return
	}
	console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, ">", b)
}


export function assertLowerThan(a: number, b: number) {
	if (a < b) {
		console.log("%cAssertion passed", "color: green; font-weight: bold;", a, "<", b)
		return
	}
	console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, "<", b)
}

export function assertEq(a: unknown, b: unknown) {
	if (a === b) {
		console.log("%cAssertion passed", "color: green; font-weight: bold;", a);
		return
	}
	console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, "!==", b);
}
