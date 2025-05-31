'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './CommentList.module.css';
import { CommentItemFragment, PostCommentsCursorDocument, PostCommentsCursorQuery } from '@/app/graphql/generated';
import Comment from '@/components/ui/Comment';
import { useQuery } from '@apollo/client';
import { setFlash } from '@/actions/flash';

type CommentListProps = {
  comments: CommentItemFragment[];
  postId: string;
  endCursor: string;
};

const COMMENTS_PER_PAGE = 20;

export default function CommentList({ comments, postId, endCursor }: CommentListProps) {
  const [displayedComments, setDisplayedComments] = useState<CommentItemFragment[]>(comments);
  const [currentCursor, setCurrentCursor] = useState<string>(endCursor);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { fetchMore } = useQuery<PostCommentsCursorQuery>(PostCommentsCursorDocument, {
    skip: true,
  });

  const loadMoreComments = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);
    try {
      const result = await fetchMore({
        variables: {
          postId,
          first: COMMENTS_PER_PAGE,
          after: currentCursor,
        },
      });

      const newComments = result.data.postCommentsCursor.edges.map(edge => edge.node as CommentItemFragment);
      const pageInfo = result.data.postCommentsCursor.pageInfo;

      setDisplayedComments(prev => [...prev, ...newComments]);
      setCurrentCursor(pageInfo.endCursor || '');
      setHasNextPage(pageInfo.hasNextPage);

    } catch {
      setFlash({
        type: 'error',
        message: 'コメントの取得に失敗しました'
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchMore, hasNextPage, isLoading, postId, currentCursor]);

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreComments();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '150px',
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isLoading, currentCursor, loadMoreComments]);

  return (
    <div className={styles.commentList}>
      <h3 className={styles.commentsTitle}>
        コメント
      </h3>

      {displayedComments.length > 0 ? (
        <div className={styles.commentItems}>
          {displayedComments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className={styles.noComments}>
          まだコメントはありません
        </div>
      )}

      {hasNextPage && (
        <div
          ref={observerTarget}
          className={`${styles.loadingIndicator} ${isLoading ? styles.visible : ''}`}
        >
          {isLoading && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>コメントを読み込み中...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
