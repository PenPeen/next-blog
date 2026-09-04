---
name: pr-doc
description: 現在のブランチの変更からレビュー向けの読み合わせ資料を作り、docs/pr/<slug>.src.html に書く。変更が画面に出るものは実際のアプリを動かしてキャプチャを撮り、変更前後を並べて載せる。PR を出す前、または PR の内容が変わったときに使う。「PR ドキュメント作って」「レビュー資料作って」「pr-doc」などの指示で発動する。
---

# pr-doc

PR のレビュー担当が読む資料を単一ファイルの HTML で作る。CI が画像を data URI に畳んで
artifact に上げ、PR 本文にリンクを載せる。artifact は `archive: false` で zip されないので、
リンクを開けばブラウザでそのまま読める。

## 成果物

```
docs/pr/
  <slug>.src.html          編集用。画像は assets/<slug>/ の相対参照
  assets/<slug>/*.png      キャプチャ
tools/pr-doc/
  template.html            下敷き
  embed_images.py          画像を data URI に畳んで 1 ファイルにする
```

`<slug>` はブランチ名の `/` を `-` に置換したもの。CI はこの名前でファイルを探すので、
違う名前にすると生成がスキップされる。

## 手順

1. `git branch --show-current` から slug を作る
2. `git diff origin/main...HEAD` と `git log origin/main..HEAD` を読む。差分が大きいときは
   ファイル一覧を先に取り、変更の中心になるファイルから読む
3. 変更が画面の見た目に出るなら、下の「キャプチャの撮り方」で画像を用意する
4. `tools/pr-doc/template.html` を `docs/pr/<slug>.src.html` にコピーして本文を書く
5. `python3 tools/pr-doc/embed_images.py docs/pr/<slug>.src.html -o pr-doc.html` を実行する
6. `pr-doc.html` をブラウザで開いて、画像が出ているか目で確認する

## 節構成

1. この PR で何をしたか — 変更後に何ができるようになるかを 2〜3 文
2. 背景と目的 — なぜこの変更が要るのか。解決する問題
3. 画面の変化 — 変更前後のキャプチャ。見た目が変わらない PR では省く
4. 変更の全体像 — 変更したファイルと役割の表
5. ファイルごとの説明 — 主要なファイルについて、何をどう変えたか
6. レビューで見てほしい点 — 判断に迷った箇所、設計上の選択、影響範囲
7. 検証したこと — 実行したコマンドと結果

目次サイドバーの `<li>` は節と対応させる。節を足したら目次にも足す。

diff から読み取れないこと（背景、採らなかった案）は書かない。会話や tasks.md で
分かっている場合だけ書く。埋めるために推測を混ぜない。

## キャプチャの撮り方

実データの画面を撮る。バックエンドは別リポジトリの `PenPeen/rails_blog` で、
Docker で起こしてから next-blog を繋ぐ。

```bash
# 1. バックエンド（初回は clone と db:create db:migrate db:seed も要る）
docker compose --project-directory <rails_blog のパス> up -d db web

# 2. フロント。NEXT_PUBLIC_RAILS_API_DOMAIN が無いと ApolloError でエラーページになる
npm run dev
```

Playwright MCP でページを開き、`browser_take_screenshot` で撮る。保存先は
リポジトリ配下しか受け付けないため `.playwright-mcp/` に撮り、
`docs/pr/assets/<slug>/` へコピーする。

- 変更前の画面は、変更をコミットする前に撮っておくか、`git stash` で戻して撮る
- ページ全体ではなく、変わった部分が分かる範囲を `target` で絞る
- 画像は data URI で HTML に埋まるので、大きすぎると artifact が膨らむ。
  1 枚 200KB 程度に収める。大きいときは `type: "webp"` を使う

コンポーネント単位で見せたいときは `src/app/(dev)/preview/<name>/page.tsx` に
プレビューページを置く。本番に出さないよう `process.env.NODE_ENV === 'production'` なら
`notFound()` を返す。`date-formatter` が実例。

## HTML の書き方

テンプレートに用意してあるクラスを使う。

変更前後を並べる:

```html
<div class="compare">
  <figure class="before">
    <span class="tag">変更前</span>
    <img src="assets/<slug>/before.png" alt="変更前の一覧画面">
  </figure>
  <figure class="after">
    <span class="tag">変更後</span>
    <img src="assets/<slug>/after.png" alt="変更後の一覧画面">
  </figure>
</div>
```

1 枚だけ載せる:

```html
<figure>
  <img src="assets/<slug>/list.png" alt="投稿一覧">
  <figcaption>投稿一覧。日付が相対表示になっている</figcaption>
</figure>
```

他に `.note`（補足の囲み）、`.callout`（冒頭の注意書き）、`table`、`pre code` が使える。
差分を引くときは `pre` の中で `<span class="add">` と `<span class="del">` を使う。

## 注意

- 画像の `src` は `.src.html` からの相対パス。`docs/pr/` に置くので `assets/<slug>/...` になる
- `embed_images.py` は画像が 1 枚でも欠けていると終了コード 1 で止まる。パスを直して再実行する
- 出来上がった HTML が 20MB を超えたら画像が大きすぎる。枚数か形式を見直す
