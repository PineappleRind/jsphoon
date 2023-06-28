import process from "process";

import { getSettings } from "./frontend/settings";
import parse from "args-parser";
import { getMoon } from "./calculations/getMoon";

const args = parse(process.argv);
const settings = getSettings(args as any);
getMoon(settings);
