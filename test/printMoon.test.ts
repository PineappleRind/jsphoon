import { findTranslation, getLineOfMoon } from "@/printMoon";
import { describe, expect, test } from "bun:test";

describe("Print moon", () => {
	test("Individual lines", () => {
		expect(
			getLineOfMoon(
				8,
				2460133.4999996666,
				{
					y: 16,
					x: 32,
				},
				4.238424777304267,
				0.45641707534847403,
				{
					lines: 32,
					noText: false,
					noColor: false,
					language: "en",
					hemisphere: "north",
					showHemisphereText: false,
					date: 1688774400,
				},
			),
		).toBe("     /            @@@@@@@@@@@   .  @@   @@@@@@\t ");
	});

	test("Get translation", () => {
		expect(findTranslation("en")).toEqual({
			newMoon: "New Moon",
			firstQuarter: "First Quarter",
			fullMoon: "Full Moon",
			lastQuarter: "Last Quarter",
			northernHemisphere: "Northern Hemisphere",
			southernHemisphere: "Southern Hemisphere",
		});
	});
});
