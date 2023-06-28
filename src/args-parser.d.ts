declare module "args-parser" {
	/** @param string The command with arguments to parse */
	function Parse(string: string[]): Args;
	export default Parse;

	export type Args = { [arg: string]: boolean | string };
}
