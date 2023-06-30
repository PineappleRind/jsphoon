import { yaro } from "yaro-parser";
import { CLIFlag, flags } from "./flags";
import { Language } from "../ii8n";
import { KeysMatchingType } from "@/utils/types";

export type Settings = {
    date: number;
    lines: number;
    noText: boolean;
    noColor: boolean;
    language: Language;
    hemisphere: "north" | "south";
    showHemisphereText: boolean;
};

export const args = yaro(process.argv);
export function getSettingsFromArgs(
    args: Record<string, string | boolean>,
): Settings {
    const settings: Settings = {} as Settings;
    for (const flag of flags) {
        console.log(args, flag)
        const userSuppliedThisFlag =
            args[flag.long] || (flag.short && args[flag.short]);
        if (!userSuppliedThisFlag) continue;
        // if this flag is a boolean flag
        const camelizedFlagName = camelize(flag.long) as keyof typeof settings;
        if (!flag.type)
            settings[camelizedFlagName as KeysMatchingType<Settings, boolean>] = true;
        else
            (settings[camelizedFlagName] as Settings[typeof camelizedFlagName]) =
                parseFlagType<typeof camelizedFlagName>(flag, args[flag.long]);
    }
    return settings;
}

function parseFlagType<T extends keyof Settings>(
    flag: CLIFlag,
    value: string | boolean | undefined,
): Settings[T] {
    switch (flag.type) {
        case "integer": {
            const tryInt = parseInt(value?.toString() || "");
            if (isNaN(tryInt)) misusedFlag(flag);
            return tryInt;
        }
        default:
            throw new Error(`Invalid flag type to parse "${flag.type}"`);
    }
}

function misusedFlag(flag: CLIFlag) {
    console.log(`Flag --${flag.long} should be of type ${flag.type}\n\nDescription of --${flag.long}: ${flag.description}`);
}

const camelize = (s: string): string =>
    s.replace(/-./g, (x) => x[1].toUpperCase());
