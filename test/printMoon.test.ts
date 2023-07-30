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

		expect(
			getLineOfMoon(
				5,
				2459341.988194111,
				{
					y: 7.5,
					x: 15,
				},
				5.455851868577912,
				-0.6768410976807397,
				{
					date: 1620387780,
					language: "fr",
					lines: 15,
					noColor: false,
					noText: false,
					hemisphere: "north",
					showHemisphereText: false,
				},
			),
		).toBe("  @@@  \t Dernier quartier +");

		expect(
			getLineOfMoon(
				16,
				2431898.467360778,
				{
					y: 16,
					x: 32,
				},
				3.377137001761194,
				0.9723874496002586,
				{
					date: -750732420,
					language: "hy",
					lines: 32,
					noColor: false,
					noText: false,
					hemisphere: "north",
					showHemisphereText: false,
				},
			),
		).toBe(
			" |          @                             @@@@@       @@@       \t Վերջին քառորդ -",
		);

		expect(
			getLineOfMoon(17, 2462500.5487612407, { "y": 15.5, "x": 31 }, 1.1972631804049843, -0.36490721706428947, { "date": 1893287413, "lines": 31, "noText": false, "noColor": false, "language": "en", "hemisphere": "south", "showHemisphereText": true })
		).toBe("                                         @@@@@@@@@@@@@@@@@@@@@  Southern Hemisphere")
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
