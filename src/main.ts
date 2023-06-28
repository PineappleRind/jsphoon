import process from "process";
import parse from "args-parser";

import { getSettings } from "@/frontend/settings";
import { printMoon } from "@/printMoon";
import { correctPhase } from "./calculations/correctPhase";

const args = parse(process.argv);
const settings = getSettings(args as any);
printMoon(settings);
