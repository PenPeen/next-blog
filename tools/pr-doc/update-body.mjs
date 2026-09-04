import { readFile, writeFile } from "node:fs/promises";

// PR 本文のうちこのマーカーに挟まれた範囲だけを差し替える。push のたびに
// artifact URL が変わるため、人が書いた本文を残したまま毎回書き換える必要がある。
const START = "<!-- pr-doc:start -->";
const END = "<!-- pr-doc:end -->";

const [path, artifactUrl, runUrl] = process.argv.slice(2);

if (!path || !artifactUrl || !runUrl) {
  console.error("使い方: node update-body.mjs <本文ファイル> <artifact URL> <run URL>");
  process.exit(1);
}

const section = [
  START,
  "## レビュー用ドキュメント",
  "",
  `[pr-doc.html](${artifactUrl}) — 変更の背景と読みどころ、画面のキャプチャをまとめたページ。GitHub にログインした状態で開くとブラウザで表示される。`,
  "",
  `生成: [${runUrl.split("/").pop()}](${runUrl}) / 保存期間 14 日`,
  END,
].join("\n");

const body = await readFile(path, "utf8");
const start = body.indexOf(START);
const end = body.indexOf(END);

const updated =
  start !== -1 && end !== -1
    ? body.slice(0, start) + section + body.slice(end + END.length)
    : `${body.trimEnd()}\n\n${section}\n`;

await writeFile(path, updated);
