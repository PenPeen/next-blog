# PenBlog - Next.js ブログアプリケーション

このプロジェクトは Next.js を使用したブログアプリケーションです。

## 技術スタック

### コア技術
- TypeScript: ^5.0.0
- Node.js: ^20.0.0

### フロントエンド
- Next.js: ^15.2.5
- React: ^19.0.0

### バックエンド
- Railsプロジェクト連携
  - rails_blog

### 開発ツール
- npm: ^10.0.0
- ESLint: ^9.0.0

## はじめに

開発サーバーを起動するには:

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと結果が表示されます。

`app/page.tsx` を編集することでページを更新できます。ファイルを編集すると、ページは自動的に更新されます。

## ディレクトリ構造

```
src/
├── app/                    # ルーティングとページコンポーネント
│   ├── (public)/          # 公開ページ
│   ├── types/             # 型定義
│   ├── graphql/           # GraphQL関連
│   └── ...                # その他のページコンポーネント
│
├── components/            # Reactコンポーネント
│   ├── search/            # 検索関連コンポーネント
│   ├── layouts/           # レイアウトコンポーネント
│   └── ui/                # UIコンポーネント
│
└── ...

public/                    # 静的アセット
    ├── app_logo.png       # アプリケーションロゴ
    └── ...                # その他の静的ファイル
```

## 学習リソース

Next.js について詳しく学ぶには、以下のリソースを参照してください:

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.js の機能とAPIについて学ぶ
- [Next.js チュートリアル](https://nextjs.org/learn) - インタラクティブな Next.js チュートリアル

## Vercelへのデプロイ

Next.js アプリをデプロイする最も簡単な方法は、Next.js の作成者による [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使用することです。

詳細については [Next.js デプロイドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
