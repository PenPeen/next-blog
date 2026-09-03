---
name: pr-doc
description: 現在のブランチの変更からレビュー向けの読み合わせ資料を作り、docs/pr/<slug>.json に書く。変更が画面に出るものはプレビューを撮って図として載せる。PR を出す前、または PR の内容が変わったときに使う。「PR ドキュメント作って」「レビュー資料作って」「pr-doc」などの指示で発動する。
---

# pr-doc

PR のレビュー担当が読む資料を minitype 形式の JSON で書く。表紙・目次・ページ番号・
レイアウトは `build.mjs` が付けるので、JSON にはタイトルと本文だけ書く。
PDF 化と PR 本文の更新は CI の仕事なので、ここでは触らない。

## 手順

1. `git branch --show-current` でブランチ名を取り、`/` を `-` に置換して slug にする
2. `git diff origin/main...HEAD` と `git log origin/main..HEAD` を読む。差分が大きいときは
   ファイル一覧を先に取り、変更の中心になるファイルから読む
3. 変更が画面の見た目に出るなら、下の「プレビューの撮り方」で図を用意する
4. 下の節構成で `docs/pr/<slug>.json` を書く
5. `npm run build --prefix tools/pr-doc -- docs/pr/<slug>.json` を実行する
6. 生成された `pr-doc.pdf` を読み、図が入っているか、表が枠からはみ出していないかを見る

## 節構成

1. この PR で何をしたか — 変更後に何ができるようになるかを 2〜3 文
2. 背景と目的 — なぜこの変更が要るのか。解決する問題
3. 変更の全体像 — 変更したファイルと役割の表
4. ファイルごとの説明 — 主要なファイルについて、何をどう変えたか
5. レビューで見てほしい点 — 判断に迷った箇所、設計上の選択、影響範囲
6. 検証したこと — 実行したコマンドと結果

diff から読み取れないこと（背景、採らなかった案）は書かない。会話や tasks.md で
分かっている場合だけ書く。埋めるために推測を混ぜない。

見出しの番号と目次は minitype が作る。`"1. 背景"` のように自分で番号を書くと二重になる。

## プレビューの撮り方

実アプリの画面は GraphQL バックエンドが要るため開発サーバーだけでは描画できない。
変更したコンポーネントだけを描くページを `src/app/(dev)/preview/<name>/page.tsx` に置き、
そこを撮る。`src/app/(dev)/preview/date-formatter/page.tsx` が実例。

- 本番に出さないよう、先頭で `process.env.NODE_ENV === 'production'` なら `notFound()` を返す
- 変更前後を並べると差分が一目で分かる。変更前の表示はプレビュー内に直接書く
- `npm run dev` を起こし、Playwright で該当要素だけを撮る
- PNG は `docs/pr/assets/<slug>/<name>.png` に置いて commit する

## JSON の書き方

```json
{
  "title": "投稿日の相対表示",
  "subtitle": "feat/relative-date",
  "meta": "PenPeen/next-blog #169",
  "body": [
    { "type": "text", "textType": "h1", "lines": [["節の見出し"]] },
    { "type": "text", "textType": "paragraph", "lines": [["本文。"], ["別の段落。"]] }
  ]
}
```

`lines` は「段落の配列」で、各段落が「インライン要素の配列」。文字列をそのまま置ける。

図はリポジトリルート基準のパスで書く。`width` の単位は mm で、A4 の版面幅は 170mm。
直後に caption を置くと「図 1 :」が自動で付く。

```json
{ "type": "image", "src": "docs/pr/assets/<slug>/before-after.png", "style": { "width": 120 } },
{ "type": "text", "textType": "caption", "lines": [["変更前後の表示"]] }
```

表は `easytable` の簡易記法で書く。`build.mjs` が本来の構造に展開する。
セルの文字列が長いと折り返しが枠からはみ出すので、ファイルパスは末尾 2 階層程度に縮める。

```json
{
  "type": "easytable",
  "rows": [["ファイル", "役割"], ["build.mjs", "PDF 生成"]]
}
```

他に書ける要素は `tools/pr-doc/node_modules/@minitype/minitype/dist/index.d.ts` を読む。
`validateDocument` が構造を検証するので、通らなければエラーの `path` を見て直す。

## 注意

- `npm run --prefix` 以外で `build.mjs` を呼ばない。minitype は同梱フォントのキャッシュを
  cwd に置くため、cwd がずれると 80MB 超のファイルがリポジトリルートに散らかる
- サイズ指定の単位は mm。文字サイズを pt で書きたいときは `pt()` を通す（build.mjs 側で対応済み）
- ドキュメントは PDF になる。コードブロックの長い引用は読みにくいので、
  必要な数行だけ引く
