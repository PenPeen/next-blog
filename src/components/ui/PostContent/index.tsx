import React from 'react'
import { PostFragment } from '@/app/graphql'
import styles from './PostContent.module.css'
import BackButton from '@/components/ui/BackButton'
import MainTitle from '@/components/ui/MainTitle'
import FormattedDate from '@/components/ui/DateFormatter'
import CommentList from '@/components/ui/CommentList'
import Image from 'next/image'
import { gql } from '@apollo/client'
import { COMMENT_FRAGMENT } from '@/components/ui/Comment'

type PostContentProps = {
  post: PostFragment
}

export const POST_FRAGMENT = gql`
  fragment Post on Post {
    title
    content
    thumbnailUrl
    createdAt
    comments {
      ...CommentItem
    }
  }
  ${COMMENT_FRAGMENT}
`

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <BackButton>
          ← 戻る
        </BackButton>
        <MainTitle>{post.title}</MainTitle>
        <FormattedDate date={post.createdAt} />
      </div>

      {post.thumbnailUrl && (
        <div className={styles.thumbnailContainer}>
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className={styles.thumbnail}
            priority
            unoptimized={true}
          />
        </div>
      )}

      <div className={styles.content}>
        {post.content}
      </div>

      <CommentList comments={post.comments} />
    </article>
  )
}
