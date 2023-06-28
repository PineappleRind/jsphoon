import { find2SurroundingPhases } from "@/calculations/findSurroundingPhase";
import { getPhase } from "@/calculations/phase";
import { ASPECT_RATIO, SECONDS_IN_DAY } from "@/constants/settings";
import { type Language, translations } from "@/frontend/ii8n";
import { type Settings } from "@/frontend/settings";
import { createDateString, unixToJulian } from "@/utils/date";
import moons from "@/moons";
import { lolcat } from "./frontend/lolcat";

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
		});
}
function getLineOfMoon(
	lineNumber: number,
	julianDate: number,
	moonRadius: { x: number; y: number },
	angularPhase: number,
	mcap: number,
	settings: Settings,
) {
	let line = "";

	const centerLine = Math.trunc(settings.lines / 2);
	const { phases, which } = find2SurroundingPhases(julianDate);

	const yCoordinate = lineNumber + 0.5 - moonRadius.y;
	let xRight =
		moonRadius.x * Math.sqrt(1 - yCoordinate ** 2 / moonRadius.y ** 2);
	let xLeft = -xRight;
	if (Math.PI > angularPhase && angularPhase >= 0) xLeft = mcap * xLeft;
	else xRight = mcap * xRight;

	const leftColumn = Math.trunc(moonRadius.x + 0.5) + Math.trunc(xLeft + 0.5);
	const rightColumn = Math.trunc(moonRadius.x + 0.5) + Math.trunc(xRight + 0.5);
	// Print it
	let charNumber = 0;
	let char;
	while (charNumber < leftColumn) {
		line += " ";
		charNumber++;
	}
	while (charNumber <= rightColumn) {
		// The correct moon to use at this resolution
		const rightMoon = moons[settings.lines]?.split("\n") || null;
		if (settings.hemisphere === "north")
			// Read moons from upper left to bottom right
			char = rightMoon ? rightMoon[lineNumber][charNumber] : "@";
		// read moons from bottom right to upper left
		// equivalent of rotating 180 degrees (or flipping upside down)
		else char = rightMoon ? rightMoon[-1 - lineNumber][-charNumber] : "@";
		charNumber++;
		line += char;
	}

	if (settings.lines <= 32 && !settings.noText) {
		const translation = findTranslation(settings.language);
		// Output the end-of-line information, if any
		line += "\t ";
		if (lineNumber == centerLine - 2) {
			// Now hopefully the object is in order.. 😅
			let qlits = Object.values(translation).map((text) => text + " +");
			line += qlits[Math.trunc(which[0] * 4)];
		} else if (lineNumber == centerLine - 1) {
			line += createDateString(
				Math.trunc((julianDate - phases[0]) * SECONDS_IN_DAY),
			);
		} else if (lineNumber == centerLine) {
			let nqlits = Object.values(translation).map((text) => text + " -");
			line += nqlits[Math.trunc(which[1] * 4)];
		} else if (lineNumber == centerLine + 1) {
			line += createDateString(
				Math.trunc((phases[1] - julianDate) * SECONDS_IN_DAY),
			);
		} else if (lineNumber == centerLine + 2 && settings.showHemisphereText) {
			let msg =
				settings.hemisphere === "north"
					? translation.northernHemisphere
					: translation.southernHemisphere;
			line += msg;
		}
	}
	return line;
}

function findTranslation(language: Language) {
	let translation = translations[language] || translations.en;
	if (Object.keys(translation).length < 6) {
		translation.northernHemisphere = translations.en.northernHemisphere;
		translation.southernHemisphere = translations.en.southernHemisphere;
	}
	return translation;
}
