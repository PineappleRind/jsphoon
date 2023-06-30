import { readFileSync } from "fs";
import stripJsonComments from "strip-json-comments";

const file = readFileSync("./src/frontend/ii8n.jsonc", { encoding: "utf-8" });

/** Hardcoded list of languages... */
export type Language =
	| "en"
	| "be"
	| "bg"
	| "ca"
	| "cs"
	| "da"
	| "de"
	| "et"
	| "el"
	| "es"
	| "eo"
	| "fi"
	| "fr"
	| "hr"
	| "hy"
	| "ia"
	| "it"
	| "ja"
	| "lt"
	| "nl"
	| "ru"
	| "pl"
	| "pt"
	| "ro"
	| "sk"
	| "sr"
	| "sv"
	| "uk"
	| "th"
	| "ko"
	| "kn"
	| "zh_TW"
	| "ar"
	| "nb"
	| "nn"
	| "cy"
	| "tr";

export type Translation = {
	newMoon: string;
	firstQuarter: string;
	fullMoon: string;
	lastQuarter: string;
	northernHemisphere: string;
	southernHemisphere: string;
};
export const phaseMap = ["newMoon", "firstQuarter", "fullMoon", "lastQuarter"];
export const translations: Record<Language, Translation> = JSON.parse(
	stripJsonComments(file),
);
