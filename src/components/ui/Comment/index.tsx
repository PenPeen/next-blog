import React from 'react'
import styles from './Comment.module.css'
import { CommentItemFragment } from '@/app/graphql/generated'
import FormattedDate from '@/components/ui/DateFormatter'
import { gql } from '@apollo/client'

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
  return (
    <div className={styles.commentItem} data-testid="comment-item">
      <div className={styles.commentHeader}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{comment.user.name}</span>
        </div>
        <FormattedDate date={comment.createdAt} />
      </div>
      <div className={styles.commentContent}>
        {comment.content}
      </div>
    </div>
  )
}
