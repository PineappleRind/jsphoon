import { ASPECT_RATIO } from "@/constants/settings";
import { find2SurroundingPhases } from "@/calculations/findSurroundingPhase";
import { unixToJulian } from "@/utils/date";
import { getPhase } from "@/utils/phase";
import { type Settings } from "@/frontend/settings";
import moons from "@/moon";

export function printMoon(settings: Settings) {
	const julianDate = unixToJulian(settings.date);
	let { phaseRadians } = getPhase(julianDate);
	// Fix waxing/waning direction for south hemisphere
	if (settings.hemisphere === "south") phaseRadians = 1 - phaseRadians;
	const angularPhase = phaseRadians * 2 * Math.PI;
	const mcap = -Math.cos(angularPhase);
	// Figure out how big the moon is
	const moonRadius = {
		y: settings.lines / 2,
		x: settings.lines / 2 / ASPECT_RATIO,
	};
	// Figure out some other random stuff
	const centerLine = Math.round(settings.lines / 2);
	const which = find2SurroundingPhases(julianDate);

	// Now output the moon, a slice at a time
	for (let lineNumber = 0; lineNumber < settings.lines; lineNumber++) {
		const line = getLineOfMoon(
			lineNumber,
			moonRadius,
			angularPhase,
			mcap,
			settings,
		);
		process.stdout.write(line);
	}
	let phases;
}
function getLineOfMoon(
	lineNumber: number,
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

	const leftColumn = Math.round(moonRadius.x + 0.5) + Math.round(xLeft + 0.5);
	const rightColumn = Math.round(moonRadius.x + 0.5) + Math.round(xRight + 0.5);

	// Print it
	let charNumber = 0;
	let char;
	while (charNumber < leftColumn) {
		process.stdout.write(" ");
		charNumber++;
	}
	while (charNumber <= rightColumn) {
		// The correct moon to use at this resolution
		const rightMoon = moons[settings.lines]?.split("\n") || null;
		if (settings.hemisphere == "north")
			// Read moons from upper left to bottom right
			char = rightMoon ? rightMoon[lineNumber][charNumber] : "@";
		// read moons from bottom right to upper left
		// equivalent of rotating 180 degrees (or flipping upside down)
		else char = rightMoon ? rightMoon[-1 - lineNumber][-charNumber] : "@";
		charNumber++;
		line += char;
	}
	return line + "\n";
}
