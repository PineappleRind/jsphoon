import process from "process";

import { args, getSettingsFromArgs } from "@/frontend/cli/parseV2";
import { printMoon } from "@/printMoon";

const settings = getSettingsFromArgs(args);
console.log(settings)
printMoon(settings);
