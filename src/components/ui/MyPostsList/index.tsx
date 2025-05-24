import React from 'react';
import styles from './MyPostsList.module.css';
import { MyPostItem } from '@/components/ui/MyPostItem';
import MainTitle from '@/components/ui/MainTitle';
import { getMyPosts } from '@/fetcher';
import { Post } from '@/app/graphql';
import Button from '@/components/ui/Button';
import Link from 'next/link';

type MyPostsListProps = {
  currentPage: number;
  perPage: number;
};

export default async function MyPostsList({ currentPage, perPage }: MyPostsListProps) {
  const data = await getMyPosts(currentPage, perPage);
  const myPosts = await data.json();

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <MainTitle>記事一覧</MainTitle>
        <Link href="/account/my-posts/new">
          <Button type="primary" isSolid isRadius>
            新規作成
          </Button>
        </Link>
      </div>

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
