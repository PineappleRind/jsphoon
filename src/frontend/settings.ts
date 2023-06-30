import {
	DEFAULT_HEMISPHERE,
	DEFAULT_LANGUAGE,
	DEFAULT_NO_COLOR,
	DEFAULT_NO_TEXT,
	DEFAULT_SHOW_HEMISPHERE_TEXT,
	DEFAULT_SIZE_LINES,
} from "@/constants/settings";
import { Language, translations } from "@/frontend/ii8n";
import { Nullable } from "@/utils/types";

export type Settings = {
	date: number;
	lines: number;
	noText: boolean;
	noColor: boolean;
	language: Language;
	hemisphere: "north" | "south";
	showHemisphereText: boolean;
};

export function getDefaultSettings(): Settings {
	return {
		date: Math.trunc(Date.now() / 1000),
		language: DEFAULT_LANGUAGE,
		lines: DEFAULT_SIZE_LINES,
		noColor: DEFAULT_NO_COLOR,
		noText: DEFAULT_NO_TEXT,
		hemisphere: DEFAULT_HEMISPHERE,
		showHemisphereText: DEFAULT_SHOW_HEMISPHERE_TEXT,
	};
}

export function getSettingsFromArgs(args: {
	[arg: string]: boolean | string | undefined;
}): Settings {
	const settings: Nullable<Settings> = {} as Nullable<Settings>;

	if (tryNumber(args.lines)) settings.lines = tryNumber(args.lines);
	if (tryBoolean(args["no-text"]))
		settings.noText = tryBoolean(args["no-text"]);
	if (tryBoolean(args["no-color"]))
		settings.noColor = tryBoolean(args["no-color"]);

	if (typeof args.language === "string" && args.language in translations)
		settings.language = args.language as Language;

	if (["north", "south"].includes(args.hemisphere?.toString() || ""))
		settings.hemisphere = args.hemisphere?.toString() as "north" | "south";

	if (tryBoolean(args["show-hemisphere-text"]))
		settings.showHemisphereText = tryBoolean(args["show-hemisphere-text"]);

	// Since +"" === 0, use a non-empty string if no date is supplied
	const stringDate = args.date?.toString() || "No date supplied";
	const tryDate = new Date(!isNaN(+stringDate) ? +stringDate : stringDate);
	if (tryDate.toString() !== "Invalid Date")
		settings.date = Math.trunc(tryDate.getTime() / 1000);

	// Casting this to Settings should be typesafe as AFAIK
	// settings should never contain the wrong type for a field
	return {
		...getDefaultSettings(),
		...settings,
	} as Settings;
}

function tryNumber(target: string | boolean | undefined) {
	const maybeNumber = parseInt(target?.toString() || "");
	return isNaN(maybeNumber) ? null : maybeNumber;
}

function tryBoolean(target: string | boolean | undefined): boolean {
	const maybeBoolean =
		target === "false" ? false : target === "true" ? true : !!target;
	return maybeBoolean;
}
