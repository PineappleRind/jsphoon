import process from "process";
import { yaro } from "yaro-parser";

import { getSettingsFromArgs } from "@/frontend/settings";
import { printMoon } from "@/printMoon";

const args = yaro(process.argv);
const settings = getSettingsFromArgs(args);

printMoon(settings);
