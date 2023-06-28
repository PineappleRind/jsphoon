import ii8n from "./ii8n.json";

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
export const translations: Record<Language, Translation> = ii8n;
