import { describe, expect, test } from "bun:test";
import { truePhase } from "../src/calculations/truePhase";
import { meanPhase } from "../src/calculations/meanPhase";

describe("Phase calculations", () => {
	test("True phase", () => {
		expect(truePhase(6, 0.25)).toBeCloseTo(2415205.5095272576, 5);
		expect(truePhase(1492, 0.75)).toBeCloseTo(2459102.8946549026, 5);
	});

	test("Mean phase", () => {
		expect(meanPhase(2460123.446111, 1521.3255)).toBeCloseTo(
			2459946.39693635,
			5,
		);
	});
});
