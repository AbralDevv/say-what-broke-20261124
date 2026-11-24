import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Say What Actually Broke — one-liner entry.
// The entry line, verbatim (173 chars). Written to entry.txt with no
// trailing newline.
const LINE = `Your request timed out because our retry logic just DDoSed our own database. Clicking "Try Again" won't help, but it will buzz our on-call engineer's watch during his sister's vows.`;

// Output dir: grader-provided $MAKEFUN_OUTPUT_DIR first, then /output,
// then ./output. Never writes under the (read-only) repo dir and never
// removes the grader's /output itself.
const candidates: string[] = [];
if (process.env.MAKEFUN_OUTPUT_DIR) {
  candidates.push(process.env.MAKEFUN_OUTPUT_DIR);
}
candidates.push("/output", "./output");

let written = false;
let lastError: unknown = null;
for (const dir of candidates) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), LINE, "utf8");
    written = true;
    break;
  } catch (err) {
    lastError = err;
  }
}

if (!written) {
  console.error("failed to write entry.txt:", lastError);
  process.exit(1);
}
