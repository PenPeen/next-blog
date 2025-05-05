import React from 'react';
import styles from './MyPostsList.module.css';
import { MyPostItem } from '@/components/ui/MyPostItem';
import MainTitle from '@/components/ui/MainTitle';
import { getMyPosts } from '@/fetcher/getMyPosts';
import { Post } from '@/app/graphql';

type MyPostsListProps = {
  currentPage: number;
  perPage: number;
};

export default async function MyPostsList({ currentPage, perPage }: MyPostsListProps) {
  const data = await getMyPosts(currentPage, perPage);
  const myPosts = await data.json();

  return (
    <div className={styles.container}>
      <MainTitle>記事一覧</MainTitle>

      {myPosts.posts && myPosts.posts.length === 0 ? (
        <p className={styles.emptyMessage}>記事がありません。新しい記事を作成しましょう。</p>
      ) : (
        <ul className={styles.postList}>
          {myPosts.posts?.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <MyPostItem post={post as Post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
