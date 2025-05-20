import React from 'react';
import styles from './MyPostItem.module.css';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Post } from '@/app/graphql';
import { gql } from '@apollo/client';
import Link from 'next/link';

export const MY_POST_ITEM_FRAGMENT = gql`
  fragment MyPostItem on Post {
    id
    title
    published
  }
`

export function MyPostItem({ post }: { post: Post }) {
  return (
    <div className={styles.postItem}>
      <div className={styles.titleContainer}>
        <Link href={`/my-posts/${post.id}`} className={styles.titleLink}>{post.title}</Link>
      </div>
      <div className={styles.statusContainer}>
        <StatusBadge status={post.published ? 'published' : 'draft'} />
      </div>
    </div>
  );
}
