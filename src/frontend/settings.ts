import {
	DEFAULT_HEMISPHERE,
	DEFAULT_LANGUAGE,
	DEFAULT_NO_TEXT,
	DEFAULT_NO_COLOR,
	DEFAULT_SHOW_HEMISPHERE_TEXT,
	DEFAULT_SIZE_LINES,
} from "@/constants/settings";
import { translations, Language } from "@/frontend/ii8n";

export type Settings = {
	/** UNIX Timestamp */
	date: number;
	lines: number;
	noText: boolean;
	noColor: boolean;
	language: Language;
	hemisphere: "north" | "south";
	includeHemisphereText: boolean;
};

export function getSettings(args: {
	[arg: string]: boolean | string | number | undefined;
}) {
	const settings: Settings = {} as Settings;
	// Resolution
	settings.lines =
		typeof args.lines === "number" ? args.lines : DEFAULT_SIZE_LINES;
	// Don't print text
	settings.noText =
		typeof args.noText === "boolean" ? args.noText : DEFAULT_NO_TEXT;
	// Don't print colors
	settings.noColor =
		typeof args.noColor === "boolean" ? args.noColor : DEFAULT_NO_COLOR;
	// Language
	settings.language =
		typeof args.language === "string" && args.language in translations
			? (args.language as Language)
			: DEFAULT_LANGUAGE;
	// Hemisphere
	settings.hemisphere = ["north", "south"].includes(
		args.hemisphere?.toString() || "",
	)
		? (args.hemisphere as "north" | "south")
		: DEFAULT_HEMISPHERE;
	// Include hemisphere text
	settings.includeHemisphereText =
		typeof args.includeHemisphereText === "boolean"
			? args.includeHemisphereText
			: DEFAULT_SHOW_HEMISPHERE_TEXT;
	// Date
	const tryDate = new Date(
		typeof args.date === "number" ? args.date : args.date?.toString() || "",
	);
	settings.date =
		tryDate.toString() === "Invalid Date"
			? Date.now() / 1000
			: tryDate.getTime() / 1000;
	return settings;
}
