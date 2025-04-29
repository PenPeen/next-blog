import React from 'react';
import styles from './MyPostsList.module.css';
import { MyPostItem } from '@/components/features/posts/MyPostItem';
import MainTitle from '@/components/ui/MainTitle/MainTitle';
import { Post } from '@/app/types';

// サンプルデータ（後で削除）
const samplePosts: Post[] = [
  { id: 1, title: '初めてのブログ記事', published: true, userId: 1, content: '初めての記事', thumbnailUrl: 'https://via.placeholder.com/150', createdAt: '2021-01-01', updatedAt: '2021-01-01' },
  { id: 2, title: '作成中の記事', published: false, userId: 1, content: '作成中の記事', thumbnailUrl: 'https://via.placeholder.com/150', createdAt: '2021-01-01', updatedAt: '2021-01-01' },
  { id: 3, title: 'プログラミングのコツ', published: true, userId: 1, content: 'プログラミングのコツ', thumbnailUrl: 'https://via.placeholder.com/150', createdAt: '2021-01-01', updatedAt: '2021-01-01' },
];

export default function MyPostsList() {
  // TODO: 後でGraphQLからデータを取得する
  const posts = samplePosts;

  return (
    <div className={styles.container}>
      <MainTitle>記事一覧</MainTitle>

      {posts.length === 0 ? (
        <p className={styles.emptyMessage}>記事がありません。新しい記事を作成しましょう。</p>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <MyPostItem post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
