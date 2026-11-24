// Everyday Things, Two Lines — entry generator.
// Writes a two-line explanation of rain to /output/entry.txt
// (or ./output/entry.txt when /output is not writable).
// Deterministic, Node stdlib only, no network, no model calls.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const LINE_1 =
  "Rain is the sky wringing out a giant sponge over the world.";
const LINE_2 =
  "It maps how clouds hold water and let it go in drops, but it leaves out that no hand is squeezing — the cold air does the wringing on its own.";

const entry = `${LINE_1}\n${LINE_2}\n`;

// Gate check (mirrors the sealed scorer): UTF-8 text, 1–400 chars,
// not only whitespace, exactly two lines, each one sentence.
const lines = entry.trimEnd().split("\n");
if (entry.length < 1 || entry.length > 400) {
  throw new Error(`entry is ${entry.length} characters, outside the 1–400 gate`);
}
if (lines.length !== 2) {
  throw new Error(`entry has ${lines.length} lines, expected 2`);
}
for (const line of lines) {
  if (!line.trim() || line.trim().split(/[.!?]\s*$/).filter(Boolean).length !== 1) {
    throw new Error(`line is not a single sentence: ${JSON.stringify(line)}`);
  }
}

function main(): void {
  const candidates = ["/output/entry.txt", join(process.cwd(), "output", "entry.txt")];
  let written = "";
  let lastError: unknown;
  for (const target of candidates) {
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, entry, "utf8");
      written = target;
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!written) {
    throw lastError instanceof Error ? lastError : new Error("could not write entry");
  }
  console.log(`Wrote ${entry.length} characters to ${written}`);
}

main();
