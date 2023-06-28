/**
 * Adapted from https://github.com/robertmarsal/lolcatjs/ for TypeScript / only the functionality I needed
 */
import fullcolor from "fullcolor";

type RGBColor = {
	red: number;
	green: number;
	blue: number;
};

type Options = {
	/** Seed of the rainbow, use the same for the same pattern */
	seed: number;
	/** Spread of the rainbow */
	spread: number;
	/** Frequency of the rainbow colors */
	frequency: number;
};

let options: Options = {
	seed: 0,
	spread: 8.0,
	frequency: 0.05,
};

const printColorizedChar = function (char: string, colors: RGBColor) {
	process.stdout.write(fullcolor(char, colors.red, colors.green, colors.blue));
};

const printColorizedLine = (line: string) => {
	for (const [i, char] of line.split("").entries())
		printColorizedChar(
			char,
			rainbowFromSeed(options.frequency, options.seed + i / options.spread),
		);
	process.stdout.write("\n");
};

const rainbowFromSeed = (frequency: number, i: number) => {
	const red = Math.round(Math.sin(frequency * i + 0) * 127 + 128);
	const green = Math.round(
		Math.sin(frequency * i + (2 * Math.PI) / 3) * 127 + 128,
	);
	const blue = Math.round(
		Math.sin(frequency * i + (4 * Math.PI) / 3) * 127 + 128,
	);

	return { red, green, blue };
};

/** Print cool rainbow text to stdout. */
export function lolcat(text: string, overrideOptions?: Partial<Options>) {
	options = {
		...options,
		...overrideOptions,
	};

	const lines = text.split("\n");

	for (const line in lines) {
		options.seed += 1;
		printColorizedLine(lines[line]);
	}
}
