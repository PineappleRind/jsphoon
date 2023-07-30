import { getSettings } from "@/frontend/settings";
import { printMoon } from "@/printMoon";

const settings = getSettings();
printMoon(settings);
