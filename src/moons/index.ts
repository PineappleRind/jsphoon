import { readdirSync } from "fs";

const moonFileNames = readdirSync("./src/moons");
const moons: { [x: string]: string } = {};
for (const moonFile of moonFileNames) {
	if (!moonFile.endsWith("txt")) continue;
	const text = await Bun.file(`./src/moons/${moonFile}`).text();
	moons[moonFile.replace(".txt", "")] = text;
}

export default moons;
