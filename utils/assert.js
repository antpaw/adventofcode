"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertGreaterThan = assertGreaterThan;
exports.assertLowerThan = assertLowerThan;
exports.assertEq = assertEq;
function assertGreaterThan(a, b) {
    if (a > b) {
        console.log("%cAssertion passed", "color: blue; font-weight: bold;", a, ">", b);
    }
    else {
        console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, ">", b);
    }
    return a;
}
function assertLowerThan(a, b) {
    if (a < b) {
        console.log("%cAssertion passed", "color: blue; font-weight: bold;", a, "<", b);
    }
    else {
        console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, "<", b);
    }
    return a;
}
function assertEq(a, b) {
    if (a === b) {
        console.log("%cAssertion passed", "color: green; font-weight: bold;", a);
    }
    else {
        console.error("%cAssertion failed:", "color: red; font-weight: bold;", a, "!==", b);
    }
    return a;
}
