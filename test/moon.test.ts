import { describe, expect, test } from "bun:test";
import { correctPhase } from "@/calculations/correctPhase";
import { meanPhase } from "@/calculations/meanPhase";
import { getPhase, kepler } from "@/calculations/phase";
import {
	find2SurroundingPhases,
	find5SurroundingPhases,
} from "@/calculations/findSurroundingPhase";

describe("Phase helpers", () => {
	test("Kepler equation", () => {
		expect(kepler(173.80543792482416, 0.016718)).toBeCloseTo(
			3.0352516104106066,
		);
	});
});

describe("Phase calculations", () => {
	test("Get phase from date", () => {
		const {
			phaseDegrees,
			phaseRadians,
			distance,
			angularDiameter,
			sunDistance,
			sunAngularDiameter,
		} = getPhase(2379229.563866);
		expect(phaseDegrees).toBeCloseTo(0.9890264325212244, 3);
		expect(phaseRadians).toBeCloseTo(0.0011880189392792784, 3);
		expect(distance).toBeCloseTo(365502.0645852038, 3);
		expect(angularDiameter).toBeCloseTo(0.5448892835284473, 3);
		expect(sunDistance).toBeCloseTo(147097561.28029743, 3);
		expect(sunAngularDiameter).toBeCloseTo(0.5421921914532962, 3);
	});

	test("Correct phase", () => {
		expect(correctPhase(6, 0.25)).toBeCloseTo(2415205.5095272576, 3);
		expect(correctPhase(1492, 0.75)).toBeCloseTo(2459102.8946549026, 3);
	});

	test("Mean phase", () => {
		expect(meanPhase(2460123.446111, 1521.3255)).toBeCloseTo(
			2459946.39693635,
			5,
		);
	});

	test("Find 2 surrounding phases", () => {
		const { phases, which } = find2SurroundingPhases(2306229.918275);
		expect(phases[0]).toBeCloseTo(2306222.406562102);
		expect(phases[1]).toBeCloseTo(2306230.580827616);
		expect(which[0]).toBe(0.75);
		expect(which[1]).toBe(0);
	});

	test("Find 5 surrounding phases", () => {
		const [a, b, c, d, e] = find5SurroundingPhases(2462103.018369);
		expect(a).toBeCloseTo(2462092.0546395113);
		expect(b).toBeCloseTo(2462099.5094220075);
		expect(c).toBeCloseTo(2462107.570612963);
		expect(d).toBeCloseTo(2462114.7360729612);
		expect(e).toBeCloseTo(2462121.5884754225);
	});
});
