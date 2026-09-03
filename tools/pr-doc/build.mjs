import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { easytable, formatValidationErrors, minitype, validateDocument } from "@minitype/minitype";

// minitype は同梱フォントを cwd 起点で探すため、このスクリプトは必ず
// tools/pr-doc を cwd にして起動する（npm run build --prefix tools/pr-doc）。
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const slug = process.env.PR_DOC_SLUG;
const input = process.argv[2] ?? (slug ? `docs/pr/${slug}.json` : undefined);
const output = process.argv[3] ?? "pr-doc.pdf";

if (!input) {
  console.error("入力 JSON を指定してください: npm run build -- docs/pr/<slug>.json");
  process.exit(1);
}

// 表を素の Group[] で書くと 1 セル 10 行になるため、JSON 側は
// {"type":"easytable","rows":[[...]]} と書き、ここで本来の構造に展開する。
const groups = JSON.parse(await readFile(repoRoot + input, "utf8"), (_key, value) =>
  value?.type === "easytable" ? easytable(value.rows, value.options) : value,
);

const result = validateDocument(groups);
if (!result.ok) {
  console.error(formatValidationErrors(result.errors));
  process.exit(1);
}

await minitype(result.data).save(repoRoot + output);
