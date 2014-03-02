declare module Glob {
	export function sync(globs: string, opts?: any): string[];
}
declare function Glob (args: string[], opts: Object, callback: (err: any, paths: string[]) => void): void;
declare function Glob (args: string[], callback: (err: any, paths: string[]) => void): void;

declare module 'glob' {
export = Glob;
}
