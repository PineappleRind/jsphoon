import process from "process";
import parse from "args-parser";

import { getSettings } from "@/frontend/settings";
import { printMoon } from "@/printMoon";

const args = parse(process.argv);
const settings = getSettings(args as any);
printMoon(settings);
