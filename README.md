<center>
    <h1><pre align="center">jsphoon</pre></h1>
    ASCII Art Phase of the Moon (TypeScript version)
    <small><i>(I call it JSPhoon because it's more recognizable)</i></small>
</center>

-----

The original version of this was by Jef Poskanzer jef@mail.acme.com (Twitter: @jef_poskanzer) written in Pascal in 1979.

It's been translated by him into C, then by @igor_chubin into Python, and now by me into TypeScript.

**I'm basing this one off of the Python version.**

<center><h2><pre align="center">Usage</pre></h2></center>

I'm aiming for options to be mostly similar to the Python version usage over here [on pyphoon's readme](https://github.com/chubin/pyphoon/tree/master#usage).

```r
[ ] = optional flag
[ <> ] = required arg to flag
[ <> = X ] = default value if flag is not supplied

jsphoon [--lines <LINES=23>] [--language <LANGUAGE=en>]
        [--hemisphere <"north","south"=north>] [--date <DATE=now>]
        [--show-hemisphere-text] [--no-text] [--no-color]
```
```s
supported locales: "ar", "be", "bg", "ca", "cs", "da", "de", "en", "et", "el", "es", "eo", "fi", "fr", "hr", "hy", "ia", "it", "ko", "kn", "ja", "lt", "nl", "ru", "pl", "pt", "ro", "sk", "sr", "sv", "th", "uk", "zh_TW", "nb", "nn", "cy", "tr"
```
```c
supported dates: 
— any ISO Date
    - "2021-04-24"
    - "2021-04-24T05:20"
— UNIX timestamp, in ms
    - 1688134732982
```

Note that there is no help command as of v0.1.

<center><h2><pre align="center">Installation</pre></h2></center>
Currently, you'll have to:

```sh
git clone https://github.com/PineappleRind/jsphoon
cd jsphoon
bun i
bun src/main.ts
```

JSPhoon uses the [Bun runtime](https://bun.sh) for faster installation times and TypeScript support out-of-the-box.

<center><h2><pre align="center">Contributing</pre></h2></center>

<h3>Project Structure</h3>

```ts
src/
├── calculations/
├── constants/
├── frontend/
├── moons/
├── utils/
├── main.ts
└── printMoon.ts

test/
└── *.test.ts
```

Here's what everything does.
- **`src/calculations/`** contains the main astronomical calculations. <small><i>This was formerly in pyphoon's `astro` module.</small></i>
- **`src/constants/`** contains some constants to help in various `calculations` and determining `settings`.
- **`src/frontend/`** is honestly just an umbrella for anything user-facing. It contains things like colorization (what the user sees), parsing settings (what the user gives), and localization (how the user understands).
- **`src/moons/`** contains the raw ASCII of moons at various resolutions (column count). <small><i>Sometimes, a moon won't look correct. Maybe that's because the entire thing is shifted a bit to the left or right via spaces. I just use trial and error to find the correct offset.</i></small>
- **`src/utils/`** contains various helper functions and types for everyone, e.g. Julian date conversions and math shorthands.
- **`src/main.ts`** is the entry point. It ties everything together.
- **`src/printMoon.ts`** gets information from various `calculations`, applies it to a `moon`, and prints it along with some metadata.


- **`test/*.test.ts`** are testing files. You can run the tests with `bun test`. They usually correspond to the folder (or file, if it's directly in src/) they're helping to test; `utils.test.ts` helps with testing everything in `src/utils`, and `calculations.test.ts` helps with testing everything in `src/calculations`.

<h3>How can I help?</h3>

Here's some [information on contributing to Open Source in general](https://opensource.guide/how-to-contribute/). A lot of it applies here.

tl;dr your average open source project, you can open issues on anything pertaining to this project or PRs if you want to contribute something code-related