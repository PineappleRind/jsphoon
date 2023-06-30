import {
	Settings,
	getDefaultSettings,
	getSettingsFromArgs,
} from "@/frontend/settings";
import { describe, expect, test } from "bun:test";

describe("User-facing", () => {
	test("Settings parsing", () => {
		const defaultSettings: Settings = getDefaultSettings();

		expect(
			getSettingsFromArgs({
				date: "wodwue",
				lines: "wodwue",
			}),
		).toEqual({
			...defaultSettings,
		});

		expect(
			getSettingsFromArgs({
				date: "2022-01-12",
				"show-hemisphere-text": true,
				language: "language-doesnot-exist",
			}),
		).toEqual({
			...defaultSettings,
			showHemisphereText: true,
			date: Math.trunc(new Date("2022-01-12").getTime() / 1000),
		});

		expect(
			getSettingsFromArgs({
				date: "2020-09-24T06:02",
				language: "hy",
				lines: "71",
			}),
		).toEqual({
			...defaultSettings,
			language: "hy",
			lines: 71,
			date: Math.trunc(new Date("2020-09-24T06:02").getTime() / 1000),
		});
	});
});
