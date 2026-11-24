// One-Line Robot Wedding Vows — make.fun entry
// Writes a single line of wedding vows for a robot couple to /output/entry.txt.
// Gate: UTF-8 text, 1-160 characters, not only white space, single line.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VOW =
  "To have and to hold, to charge and to cherish, in sickness and in low battery, until a firmware update do us part.";

// Gate check: 1-160 characters, single line, not only white space.
function checkGate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 160) {
    throw new Error(`gate failed: ${chars} code points, expected 1-160`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

checkGate(VOW);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, VOW, "utf8");

// Read-back verification: the file on disk must be byte-identical to the vow.
const written = readFileSync(outPath, "utf8");
if (written !== VOW) {
  throw new Error("read-back failed: file content differs from the vow");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");
const chars = [...written].length;
console.log(
  `wrote ${outPath} (${chars} code points, sha256 ${sha256}), verified: ${JSON.stringify(written)}`,
);
