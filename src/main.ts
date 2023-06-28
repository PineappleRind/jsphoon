import process from "process";
import { yaro } from "yaro-parser";

import { getSettings } from "@/frontend/settings";
import { printMoon } from "@/printMoon";

const args = yaro(process.argv);
const settings = getSettings(args);

printMoon(settings);
