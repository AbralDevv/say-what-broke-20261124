// Say What Actually Broke — make.fun entry program.
// Writes one line of software error copy (at most 200 characters) to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR, falling back to ./output).
// Node stdlib only. No network, no secrets, no environment reads beyond
// the output directory.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: 121 characters, one line. The brutal truth about a database
// crash mid-save, with the rescue step and a punchline the reader repeats
// to a colleague. Composed by hand for this competition.
const LINE =
  "We lost your unsaved work: the database crashed mid-save. Copy what's still on screen, reload, and type faster next time.";

function resolveOutputDir(): string {
  // Explicit directory first (harness passes one on the command line),
  // then the environment, then the fixed /output, then ./output.
  const fromArgv = process.argv[2]?.trim();
  if (fromArgv) {
    return fromArgv;
  }
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  if (existsSync("/output")) {
    return "/output";
  }
  return join(process.cwd(), "output");
}

function main(): void {
  // Gate: UTF-8 text, 1-200 characters, not only whitespace, one line.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`entry line is ${LINE.length} chars, must be 1-200`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  const dir = resolveOutputDir();
  mkdirSync(dir, { recursive: true });
  // No trailing newline: the file's character count is exactly the line's.
  writeFileSync(join(dir, "entry.txt"), LINE, "utf8");
}

main();
