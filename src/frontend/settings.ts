// @ts-ignore 🤔 not sure why this has a ts error
import basicArgs from "../../lib/basicArgs";

import {
  DEFAULT_HEMISPHERE,
  DEFAULT_LANGUAGE,
  DEFAULT_NO_COLOR,
  DEFAULT_NO_TEXT,
  DEFAULT_SHOW_HEMISPHERE_TEXT,
  DEFAULT_SIZE_LINES,
} from "@/constants/settings";
import { Language } from "@/frontend/ii8n";

const settingsFromArgs = basicArgs.bind(this, {
  name: "jsphoon",
  version: "0.2.0",
  description: "Phase of the moon CLI",
  options: {
    date: {
      type: "string",
      description: "The moon phase on this date",
      default: Math.trunc(Date.now() / 1000),
      alias: "d",
    },
    lines: {
      type: "number",
      description:
        "Vertical resolution of the moon; only some resolutions have a moonfile",
      default: DEFAULT_SIZE_LINES,
      alias: "n",
    },
    noText: {
      type: "boolean",
      description: "Don't show text at all (overrides other text options)",
      alias: "x",
      default: DEFAULT_NO_TEXT
    },
    noColor: {
      type: "boolean",
      description: "Don't print RGB ANSI colors",
      default: DEFAULT_NO_COLOR
    },
    language: {
      type: "string",
      description: "Locale to print text in",
      default: DEFAULT_LANGUAGE,
      alias: "l",
    },
    hemisphere: {
      type: "string",
      description: "north | south; hemisphere you're viewing the moon from",
      default: DEFAULT_HEMISPHERE,
    },
    showHemisphereText: {
      type: "boolean",
      description: "Print current hemisphere",
      default: DEFAULT_SHOW_HEMISPHERE_TEXT
    },
  }
});

export type Settings = {
  date: number;
  lines: number;
  noText: boolean;
  noColor: boolean;
  language: Language;
  hemisphere: "north" | "south";
  showHemisphereText: boolean;
};

export function getDefaultSettings(): Settings {
  return settingsFromArgs([]) as Settings
}

export function getSettings(override?: Record<string, unknown>): Settings {
  const {
    date,
    lines,
    noText,
    noColor,
    language,
    hemisphere,
    showHemisphereText,
  } = settingsFromArgs(override || process.argv) as Settings;

  return {
    date,
    lines,
    noText,
    noColor,
    language,
    hemisphere,
    showHemisphereText,
  };
}