/*
* A fork of @extremeheat/node-basic-args
* 
* This has been slightly refactored & uses
* get-them-args instead of yargs-parser
*/

import { default as argToObject } from "get-them-args"

const boolMap = {
    true: true,
    false: false,
    1: true,
    0: false,
    t: true,
    f: false,
    y: true,
    n: false,
    yes: true,
    no: false,
};

interface BasicArgsOption<T extends boolean | string | number> {
    type: T extends boolean
    ? "boolean"
    : T extends string
    ? "string"
    : T extends number
    ? "number"
    : never;
    alias?: string;
    description?: string;
    default?: T;
}

interface BasicArgsSettings {
    name: string;
    version: string;
    description: string;
    /** Throw an error instead of calling process.exit() with help screen (default: false) */
    throwOnError?: boolean;
    /** Throw an error if there are extra arguments (default: false) */
    errorOnExtra?: boolean;
    /** The -- command for opening the built-in help screen (default: help) */
    helpCommand?: string;
    options: Record<string, BasicArgsOption<boolean | string | number>>
    examples?: string[],
    // Return true here if the result is ok, otherwise a string to raise to the user along with help screen
    validate?: (args: BasicArgsParsed) => true | string;
}

type BasicArgsParsed = Record<string, boolean | string | number>;

export default function parse(
    cliSettings: BasicArgsSettings,
    argv: string[] | Record<string, unknown>
): Record<string, number | boolean | string> {
    const userSupplied = Array.isArray(argv) ? argToObject(argv || process.argv.slice(2)) : argv;

    const allOptions = new Map();
    const missingOptions = new Set();
    const parsedOptions = new Map();

    function raise(error?: string) {
        if (cliSettings.throwOnError && error) {
            throw new Error(error);
        }

        const helpMessage = generateHelpMessage(cliSettings);

        if (error) console.warn(error, "\n");
        console.error(helpMessage);
        process.exit(1);
    }

    if (userSupplied[cliSettings.helpCommand || "help"]) raise();

    for (const [key, value] of Object.entries(cliSettings.options)) {
        if (allOptions.has(key)) {
            throw new Error(`Duplicate option: ${key}`);
        }
        allOptions.set(key, value);
        const userValue = userSupplied[key] || userSupplied[value.alias as string];

        if (value.type === "boolean") {
            if (userValue && boolMap[userValue as keyof typeof boolMap] === undefined) {
                raise(
                    `Invalid value for ${key}, expected boolean. You don't need to put any arguments to use this flag.`
                );
            }
            parsedOptions.set(
                key,
                boolMap[userValue as keyof typeof boolMap] || userValue || false
            );
            continue;
        }

        // Option not supplied
        if (!userValue) {
            // Required option not supplied
            if (!value.default) missingOptions.add(key);
            // Fall back to default
            else parsedOptions.set(key, value.default);
            continue;
        }

        if (value.default && value.type === "number") {
            if (isNaN(parseInt(userValue.toString())))
                raise(
                    `Invalid value for ${key}, expected number`
                );
            parsedOptions.set(key, Number(userValue));
        } else if (value.type === "string") {
            if (typeof userValue === "number") parsedOptions.set(key, userValue.toString());
            else if (typeof userValue !== "string")
                raise(
                    `Invalid value for ${key}, expected a string but got ${typeof userValue}`
                );
            else parsedOptions.set(key, userValue);
        } else {
            throw Error(
                `Unknown type: ${value.type}, in ${key} - must be Boolean, Number, or String`
            );
        }
    }

    if (missingOptions.size) {
        const missingList = Array.from(missingOptions).join(", ");
        raise(`** Missing required options: ${missingList}`);
    }

    const extra = Object.entries(userSupplied).filter(
        (key) => !allOptions.has(key)
    );
    parsedOptions.set("_", Object.fromEntries(extra));

    if (cliSettings.errorOnExtra && extra.length) {
        raise(`** Extraneous options: ${extra.join(", ")}`);
    }

    const result = Object.fromEntries(parsedOptions);

    if (cliSettings.validate) {
        const ret = cliSettings.validate(result);
        if (ret !== true) raise(ret);
    }

    return result;
}

function generateHelpMessage(options: BasicArgsSettings) {
    let helpMessage = `${options.name} - v${options.version}\n`;
    helpMessage += `${options.description}\n`;

    if (options.examples) {
        helpMessage += "Usage:\n";
        helpMessage += options.examples.map((example) => `  ${example}\n`);
    }

    helpMessage += "\nOptions:\n";
    for (const [flagName, value] of Object.entries(options.options)) {
        const n = flagName + (value.alias ? `, -${value.alias}` : "");
        helpMessage += `  --${n}\t${value.description}${value.default ? `  (default: ${value.default})` : "  "
            }\n`;

    }
    return helpMessage;
}

