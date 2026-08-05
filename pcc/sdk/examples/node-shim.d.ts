// Minimal local @types/node stub for PCC examples that need `process`.
// Avoids adding @types/node as a project dep just for two example files.
// Covers only the surface used by the 5 example scripts.
// Intentionally NO `export {}` — must be ambient so it merges into the
// global scope of every .ts file compiled alongside it.

declare const process: {
  exitCode?: number | undefined;
  exit(code?: number): never;
  env: { readonly [key: string]: string | undefined };
  cwd(): string;
  platform: NodeJS.Platform;
};

declare namespace NodeJS {
  type Platform =
    | "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos"
    | "win32" | "android" | "cygwin" | "haiku" | "netbsd";
  interface MemoryUsage {
    rss: number; heapTotal: number; heapUsed: number; external: number;
    arrayBuffers: number;
  }
}
