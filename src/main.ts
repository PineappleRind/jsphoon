import process from "process";
import { yaro } from "yaro-parser"
import { getSettings } from "@/frontend/settings";
import { printMoon } from "@/printMoon";

const args = yaro(process.argv);
console.log(args);
const settings = getSettings(args as any);
printMoon(settings);
