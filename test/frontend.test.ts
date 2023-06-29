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
                showHemisphereText: true,
                language: "language-doesnot-exist",
            }),
        ).toEqual({
            ...defaultSettings,
            showHemisphereText: true,
            date: Math.trunc(new Date("2022-01-12").getTime() / 1000),
        });
    });
});
