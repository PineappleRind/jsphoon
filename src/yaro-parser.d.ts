declare module "yaro-parser" {
	/**
	 * @param argv process.argv
	 */
	export function yaro(
		argv: string[],
		config?: Partial<YaroConfig>,
	): Record<string, string | boolean>;

	export type YaroConfig = {
		/** Use camel case for flags */
		camelCase: boolean;
		/** Count how many times flags appear */
		autoCount: number;
		/** not sure what this is lol */
		array: unkown[];
	};
}
