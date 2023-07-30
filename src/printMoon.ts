import { find2SurroundingPhases } from "@/calculations/findSurroundingPhase";
import { getPhase } from "@/calculations/phase";
import { ASPECT_RATIO, SECONDS_IN_DAY } from "@/constants/settings";
import { type Language, translations } from "@/frontend/ii8n";
import { lolcat } from "@/frontend/lolcat";
import { type Settings } from "@/frontend/settings";
import moons from "@/moons";
import { dateStringFromJulianSeconds, unixToJulian } from "@/utils/date";

export function printMoon(settings: Settings) {
	const julianDate = unixToJulian(settings.date);
	let { phaseDegrees } = getPhase(julianDate);
	// Fix waxing/waning direction for south hemisphere
	if (settings.hemisphere === "south") phaseDegrees = 1 - phaseDegrees;
	const angularPhase = phaseDegrees * 2 * Math.PI;
	const mcap = -Math.cos(angularPhase);
	// Figure out how big the moon is
	const moonRadius = {
		y: settings.lines / 2,
		x: settings.lines / 2 / ASPECT_RATIO,
	};

	let text = "";

	for (let lineNumber = 0; lineNumber < settings.lines; lineNumber++) {
		const line = getLineOfMoon(
			lineNumber,
			julianDate,
			moonRadius,
			angularPhase,
			mcap,
			settings,
		);
		text += line + "\n";
	}
	if (!settings.noColor)
		lolcat(text, {
			seed: phaseDegrees * 100,
			frequency: Math.max(0, 0.15 - Math.log2(settings.lines) / 48),
		});
	else process.stdout.write(text);
}

export function getLineOfMoon(
	lineNumber: number,
	julianDate: number,
	moonRadius: { x: number; y: number },
	angularPhase: number,
	mcap: number,
	settings: Settings,
) {
	let line = "";

	const yCoordinate = lineNumber + 0.5 - moonRadius.y;
	let xRight =
		moonRadius.x * Math.sqrt(1 - yCoordinate ** 2 / moonRadius.y ** 2);
	let xLeft = -xRight;
	if (Math.PI > angularPhase && angularPhase >= 0) xLeft = mcap * xLeft;
	else xRight = mcap * xRight;

	const leftColumn = Math.trunc(moonRadius.x + 0.5) + Math.trunc(xLeft + 0.5);
	const rightColumn = Math.trunc(moonRadius.x + 0.5) + Math.trunc(xRight + 0.5);

	let charNumber = 0;
	let char;
	while (charNumber < leftColumn) {
		line += " ";
		charNumber++;
	}
	while (charNumber <= rightColumn) {
		// The correct moon to use at this resolution
		const rightMoon =
			moons[settings.lines.toString() as keyof typeof moons]?.split("\n") ||
			null;
			
		if (settings.hemisphere === "north")
			// Read moons from upper left to bottom right
			char = rightMoon ? rightMoon[lineNumber][charNumber] || " " : "@";
		// read moons from bottom right to upper left
		// equivalent of rotating 180 degrees (or flipping upside down)
		else
			char = rightMoon
				? rightMoon.at(-1 - lineNumber)?.at(-charNumber) || " "
				: "@";
		charNumber++;
		line += char;
	}

	const shouldPrintMetadata = settings.lines <= 32 && !settings.noText;
	if (shouldPrintMetadata)
		line += getMetadataForLine(lineNumber, settings, julianDate);

	return line;
}

function getMetadataForLine(
	lineNumber: number,
	settings: Settings,
	julianDate: number,
): string {
	const translation = findTranslation(settings.language);
	const { phases, which } = find2SurroundingPhases(julianDate);
	const centerLine = Math.trunc(settings.lines / 2);

	// Output the end-of-line information, if any
	let line = "\t ";
	if (lineNumber === centerLine - 2) {
		// Now hopefully the translation object is in order.. 😅
		const qlits = Object.values(translation).map((text) => `${text} +`);
		line += qlits[Math.trunc(which[0] * 4)];
	} else if (lineNumber === centerLine - 1) {
		line += dateStringFromJulianSeconds(
			Math.trunc((julianDate - phases[0]) * SECONDS_IN_DAY),
		);
	} else if (lineNumber === centerLine) {
		const nqlits = Object.values(translation).map((text) => `${text} -`);
		line += nqlits[Math.trunc(which[1] * 4)];
	} else if (lineNumber === centerLine + 1) {
		line += dateStringFromJulianSeconds(
			Math.trunc((phases[1] - julianDate) * SECONDS_IN_DAY),
		);
	} else if (lineNumber === centerLine + 2 && settings.showHemisphereText) {
		const msg =
			settings.hemisphere === "north"
				? translation.northernHemisphere
				: translation.southernHemisphere;
		line += msg;
	}
	return line;
}

export function findTranslation(language: Language) {
	const translation = translations[language] || translations.en;
	// fallback to english hemisphere translation
	// if they don't exist for this language
	if (Object.keys(translation).length < 6) {
		translation.northernHemisphere = translations.en.northernHemisphere;
		translation.southernHemisphere = translations.en.southernHemisphere;
	}
	return translation;
}
