import React from 'react'
import styles from './Comment.module.css'
import { CommentItemFragment } from '@/app/graphql/generated'
import FormattedDate from '@/components/ui/DateFormatter'
import { gql } from '@apollo/client'
import DOMPurify from 'isomorphic-dompurify'

type CommentProps = {
  comment: CommentItemFragment
}

export const COMMENT_FRAGMENT = gql`
  fragment CommentItem on Comment {
    id
    content
    createdAt
    user {
      name
      userImage {
        profile
      }
    }
  }
`

export default function Comment({ comment }: CommentProps) {
  // isomorphic-dompurifyはサーバーサイドでも動作する
  const sanitizedContent = DOMPurify.sanitize(comment.content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  return (
    <div className={styles.commentItem} data-testid="comment-item">
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{comment.user.name}</span>
        </div>
        <FormattedDate date={comment.createdAt} />
      </div>
      <div className={styles.commentContent}>
        {sanitizedContent}
      </div>
    </div>
  )
}
