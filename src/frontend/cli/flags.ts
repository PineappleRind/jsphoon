import { translations } from "../ii8n";

export type CLIFlag = {
    long: string;
    /** This flag's short alias (if it has one). */
    short?: string;
    /** If this flag takes a value, the type that the value is. */
    type?: string;
    /** Description of the flag, for the help command */
    description: string;
};

export const flags: CLIFlag[] = [
    {
        long: "lines",
        short: "n",
        type: "integer",
        description:
            "How many lines the moon will take up, vertically (resolution)",
    },
    {
        long: "language",
        short: "l",
        type: "locale",
        description:
            "The text will be in this locale. Pass --print-locales for a list of comma-separated locales.",
    },
    {
        long: "hemisphere",
        short: "h",
        type: "north | south",
        description: "The hemisphere you're viewing the moon from",
    },
    {
        long: "date",
        short: "d",
        type: "date",
        description:
            "The date that you're viewing the moon. This can be a UNIX timestamp or an ISO date... anything that `new Date()` can parse.",
    },
    {
        long: "show-hemisphere-text",
        description:
            "Whether or not to show the text that tells you the hemisphere. Default `false`.",
    },
    {
        long: "no-text",
        short: "x",
        description:
            "Don't show any text at all. This overrides all other text options.",
    },
    {
        long: "no-color",
        description: "If present, the moon will not have fancy colored output.",
    },
];

export const 
