import React from 'react';
import styles from './MyPostItem.module.css';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Post } from '@/app/graphql';

export function MyPostItem({ post }: { post: Post }) {
  return (
    <div className={styles.postItem}>
      <div className={styles.titleContainer}>
        {post.title}
      </div>
      <div className={styles.statusContainer}>
        <StatusBadge status={post.published ? 'published' : 'draft'} />
      </div>
    </div>
  );
}
