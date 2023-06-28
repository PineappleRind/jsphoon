import { readdirSync } from "fs";

const moonFileNames = readdirSync("./src/moon");
let moons: { [x: string]: any } = {};
for (const moonFile of moonFileNames) {
	if (!moonFile.endsWith("txt")) continue;
	const text = await Bun.file(`./src/moon/${moonFile}`).text();
	moons[moonFile.replace(".txt", "")] = text;
}

export default moons;
