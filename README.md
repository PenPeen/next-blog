# PenBlog - Next.js ブログアプリケーション

このプロジェクトは Next.js を使用した最新のブログアプリケーションです。サーバーコンポーネントを活用し、高速でSEOに最適化されたブログプラットフォームを提供します。

## 技術スタック

### コア技術
- TypeScript: ^5.0.0
- Node.js: ^20.0.0

### フロントエンド
- Next.js: ^15.2.5
- React: ^19.0.0
- CSS Modules（スタイリング）

### バックエンド連携
- Rails API（GraphQL）
- Apollo Client（GraphQL通信）

### 開発ツール
- npm: ^10.0.0
- ESLint: ^9.0.0

## 基本機能

### ブログ閲覧機能
- 記事一覧表示（ページネーション対応）
- 記事詳細表示
- カテゴリ別フィルタリング
- タグによるフィルタリング
- 全文検索

### インタラクション機能
- 記事へのコメント

### ユーザー機能
- ユーザープロフィール表示

## ページ一覧

| パス | 説明 | 主な機能 |
|------|------|----------|
| `/` | ホームページ | 最新記事一覧、人気記事、カテゴリナビゲーション |
| `/posts` | 記事一覧 | ページネーション、フィルタリング、ソート機能 |
| `/posts/[slug]` | 記事詳細 | 記事本文表示、関連記事、コメント機能 |
| `/categories/[slug]` | カテゴリページ | カテゴリ別記事一覧 |
| `/tags/[slug]` | タグページ | タグ別記事一覧 |
| `/search` | 検索ページ | 全文検索、フィルター機能 |
| `/authors/[username]` | 著者ページ | 著者情報、著者の記事一覧 |

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

## ディレクトリ構造

```
src/
├── app/                    # ルーティングとページコンポーネント
│   ├── (public)/          # 公開ページ
│   │   ├── page.tsx       # ホームページ
│   │   ├── posts/         # 記事関連ページ
│   │   ├── categories/    # カテゴリページ
│   │   ├── tags/          # タグページ
│   │   ├── search/        # 検索ページ
│   │   └── authors/       # 著者ページ
│   ├── api/               # APIルート
│   ├── types/             # 型定義
│   └── graphql/           # GraphQL関連（クエリ、ミューテーション）
│
├── components/            # Reactコンポーネント
│   ├── common/            # 共通コンポーネント
│   │   ├── buttons/
│   │   ├── forms/
│   │   └── typography/
│   ├── features/          # 機能別コンポーネント
│   │   ├── posts/         # 記事関連
│   │   ├── search/        # 検索関連
│   │   └── comments/      # コメント関連
│   ├── layouts/           # レイアウトコンポーネント
│   └── ui/                # UIコンポーネント
│
├── hooks/                 # カスタムフック
│   ├── usePagination.ts
│   └── useSearch.ts
│
├── lib/                   # ユーティリティ関数
│   ├── constants/         # 定数
│   ├── types/             # 型定義
│   └── utils/             # ヘルパー関数
│
└── dal/                   # Data Access Layer
    └── apollo/            # Apollo Client設定

public/                    # 静的アセット
    ├── app_logo.png       # アプリケーションロゴ
    └── images/            # 画像ファイル
```

## データフェッチングパターン

このアプリケーションでは、サーバーコンポーネントを使用してデータフェッチングを行います：

```typescript
// 記事一覧を取得する例
export async function getPosts(page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: GET_PUBLISHED_POSTS,
    variables: { page, perPage }
  });
  return data.publishedPosts;
};
```
