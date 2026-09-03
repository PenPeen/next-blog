import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  easytable,
  em,
  fill,
  formatValidationErrors,
  h1,
  minitype,
  p,
  page,
  physical,
  pt,
  toc,
  totalPages,
  validateDocument,
} from "@minitype/minitype";

// minitype は同梱フォントを cwd 起点で探すため、このスクリプトは必ず
// tools/pr-doc を cwd にして起動する（npm run build --prefix tools/pr-doc）。
const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

const slug = process.env.PR_DOC_SLUG;
const input = process.argv[2] ?? (slug ? `docs/pr/${slug}.json` : undefined);
const output = process.argv[3] ?? "pr-doc.pdf";

// パスはリポジトリルート基準で受け取るが、絶対パスもそのまま通す。
const resolve = (path) => (path.startsWith("/") ? path : repoRoot + path);

if (!input) {
  console.error("入力 JSON を指定してください: npm run build -- docs/pr/<slug>.json");
  process.exit(1);
}

const gray = { effects: [fill("#767676")] };

// 表を素の Group[] で書くと 1 セル 10 行になるため、JSON 側は
// {"type":"easytable","rows":[[...]]} と書き、ここで本来の構造に展開する。
// 画像の src はリポジトリルート基準で書けるようにする。
const doc = JSON.parse(await readFile(resolve(input), "utf8"), (_key, value) => {
  if (value?.type === "easytable") {
    return easytable(value.rows, value.options);
  }
  if (value?.type === "image" && typeof value.src === "string") {
    return { ...value, src: resolve(value.src) };
  }
  return value;
});

const TOC_HEADING = "目次";

// validateDocument は flow と BlockExtender を受け付けないため、
// JSON から読んだ本文だけを検証し、表紙とノンブルは検証後に足す。
const result = validateDocument([{ body: doc.body }]);
if (!result.ok) {
  console.error(formatValidationErrors(result.errors));
  process.exit(1);
}

// toc はグループをまたいで見出しを拾わないため、表紙と本文を 1 グループにして
// 改ページで分ける。
const groups = [
  {
    body: [
      {
        type: "flow",
        position: "nombre",
        blocks: [p([[page, " / ", totalPages]], { align: "center", size: pt(8.5), ...gray })],
        // 版面下端から外側へ出すため負の値を渡す。正の値だと本文に潜って見えなくなる。
        blockOffset: -10,
        page: (pageIndex) => pageIndex > 0,
      },
      { type: "vspace", space: 60 },
      p(doc.title, { align: "center", size: pt(24) }),
      { type: "vspace", space: 5 },
      p(doc.subtitle ?? "", { align: "center", size: pt(11), ...gray }),
      p(doc.meta ?? "", { align: "center", size: pt(10), ...gray }),
      { type: "vspace", space: 20 },
      h1(TOC_HEADING),
      toc({ filter: (_level, text) => text !== TOC_HEADING }),
      { type: "newpage" },
      ...result.data[0].body,
    ],
  },
];

await minitype(groups, {
  padding: 20,
  block: {
    h1: { size: pt(15) },
    h2: { size: pt(12) },
    paragraph: { size: pt(9.5), lineHeight: em(1.7) },
    image: { align: "center" },
    table: {
      align: "center",
      columnWidths: [{ type: "fr", value: 1 }, { type: "fr", value: 1.6 }],
      cellPadding: physical(1.6, 2.5),
      textStyle: (rowIndex) => (rowIndex === 0 ? { size: pt(9) } : { size: pt(9), ...gray }),
    },
    caption: { size: pt(8.5), align: "center", ...gray },
  },
}).save(resolve(output));
