---
name: pr-doc
description: 現在のブランチの変更からレビュー向けの読み合わせ資料を作り、docs/pr/<slug>.json に書く。PR を出す前、または PR の内容が変わったときに使う。「PR ドキュメント作って」「レビュー資料作って」「pr-doc」などの指示で発動する。
---

# pr-doc

PR のレビュー担当が読む資料を minitype 形式の JSON で書く。CI がこの JSON を PDF 化し、
artifact に上げて PR 本文にリンクを載せる。PDF 化と本文更新は CI の仕事なので、ここでは触らない。

## 手順

1. `git branch --show-current` でブランチ名を取り、`/` を `-` に置換して slug にする
2. `git diff origin/main...HEAD` と `git log origin/main..HEAD` を読む。差分が大きいときは
   ファイル一覧を先に取り、変更の中心になるファイルから読む
3. 下の節構成で `docs/pr/<slug>.json` を書く
4. `npm run build --prefix tools/pr-doc -- docs/pr/<slug>.json` を実行して PDF が出ることを確かめる
5. 生成された `pr-doc.pdf` を読み、意図した組版になっているかを目で確認する

## 節構成

1. この PR で何をしたか — 変更後に何ができるようになるかを 2〜3 文
2. 背景と目的 — なぜこの変更が要るのか。解決する問題
3. 変更の全体像 — 変更したファイルと役割の表
4. ファイルごとの説明 — 主要なファイルについて、何をどう変えたか
5. レビューで見てほしい点 — 判断に迷った箇所、設計上の選択、影響範囲
6. 検証したこと — 実行したコマンドと結果

diff から読み取れないこと（背景、採らなかった案）は書かない。会話や tasks.md で
分かっている場合だけ書く。埋めるために推測を混ぜない。

見出しの番号は minitype が振る。`"1. 背景"` のように自分で番号を書くと二重になる。

## JSON の書き方

トップレベルは `Group[]`。各 Group の `body` に要素を並べる。

```json
[
  {
    "body": [
      { "type": "text", "textType": "h1", "lines": [["タイトル"]] },
      { "type": "text", "textType": "h2", "lines": [["節の見出し"]] },
      { "type": "text", "textType": "paragraph", "lines": [["本文。"], ["続けて別の段落。"]] }
    ]
  }
]
```

`lines` は「段落の配列」で、各段落が「インライン要素の配列」。文字列をそのまま置ける。

表は `easytable` の簡易記法で書く。`build.mjs` が本来の構造に展開する。

```json
{
  "type": "easytable",
  "rows": [["ファイル", "役割"], ["build.mjs", "PDF 生成"]]
}
```

セルの文字列が長いと折り返しが枠からはみ出す。ファイルパスは末尾 2 階層程度に縮める。

他に書ける要素は `tools/pr-doc/node_modules/@minitype/minitype/dist/index.d.ts` を読む。
`validateDocument` が構造を検証するので、通らなければエラーの `path` を見て直す。

## 注意

- `npm run --prefix` 以外で `build.mjs` を呼ばない。minitype は同梱フォントのキャッシュを
  cwd に置くため、cwd がずれると 80MB 超のファイルがリポジトリルートに散らかる
- ドキュメントは PDF になる。コードブロックの長い引用は読みにくいので、
  必要な数行だけ引く
