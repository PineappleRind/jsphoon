declare module "get-them-args" {
    export default function parse(args: string[]): Record<string, string | boolean | number>
}