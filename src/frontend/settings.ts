import {
	DEFAULT_HEMISPHERE,
	DEFAULT_LANGUAGE,
	DEFAULT_NO_TEXT,
	DEFAULT_SHOW_HEMISPHERE_TEXT,
	DEFAULT_SIZE_LINES,
} from "../constants/settings";
import { LOCALIZATION } from "./ii8n";

export type Settings = {
	/** UNIX Timestamp */
	date: number;
	lines: number;
	noText: boolean;
	language: string;
	hemisphere: "north" | "south";
	includeHemisphereText: boolean;
};

export function getSettings(args: {
	[arg: string]: boolean | string | number | undefined;
}) {
	let settings: Settings = {} as Settings;
	settings.lines =
		typeof args.lines === "number" ? args.lines : DEFAULT_SIZE_LINES;
	settings.noText =
		typeof args.noText === "boolean" ? args.noText : DEFAULT_NO_TEXT;
	settings.language =
		typeof args.language === "string" && args.language in LOCALIZATION
			? args.language
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
	let tryDate = new Date(parseInt(args.date?.toString() || ""));
	settings.date =
		tryDate.toString() === "Invalid Date"
			? Date.now() / 1000
			: tryDate.getTime();
	return settings;
}
