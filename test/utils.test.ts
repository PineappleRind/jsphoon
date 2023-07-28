import { describe, expect, test } from "bun:test";

import {
	dateStringFromJulianSeconds,
	julianToISO,
	unixSecondsFromDate,
	unixToJulian,
} from "@/utils/date";
import { angle as angleConversion, confineAngle } from "@/utils/math";

describe("Math utils", () => {
	test("Confine angle", () => {
		expect(confineAngle(329)).toBe(329);
		expect(confineAngle(-519)).toBe(201);
	});

	test("Angle conversion to radians", () => {
		expect(angleConversion.radians(468)).toBeCloseTo(8.16814, 4);
	});

	test("Angle conversion to degrees", () => {
		expect(angleConversion.degrees(1.746)).toBeCloseTo(100.03843, 4);
	});
});

describe("Date utils", () => {
	test("Convert UNIX timestamp to Julian date", () => {
		expect(unixToJulian(1687808484)).toBeCloseTo(2460122.320416333, 4);
	});

	test("Convert Julian date to ISO date", () => {
		expect(julianToISO(2434121.446111)).toEqual([1952, 4, 18]);
	});

	test("Create date string from Julian seconds", () => {
		expect(dateStringFromJulianSeconds(201221)).toBe("2 7:53:41");
		expect(dateStringFromJulianSeconds(2710)).toBe("0 0:45:10");
	});

	test("Date() to Unix timestamp in seconds", () => {
		expect(unixSecondsFromDate(new Date(Date.UTC(2024, 3, 1, 5, 43)))).toBe(
			1711950180,
		);
	});
});
