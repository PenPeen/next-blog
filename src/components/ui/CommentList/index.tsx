import React from 'react'
import styles from './CommentList.module.css'
import { CommentItemFragment } from '@/app/graphql/generated'
import Comment from '@/components/ui/Comment'

type CommentListProps = {
  comments: CommentItemFragment[]
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className={styles.commentList} data-testid="comment-list">
      <h3 className={styles.commentsTitle}>コメント ({comments.length})</h3>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
