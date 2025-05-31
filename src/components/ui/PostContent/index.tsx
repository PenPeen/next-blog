import React from 'react'
import { PostFragment, User } from '@/app/graphql/generated'
import styles from './PostContent.module.css'
import BackButton from '@/components/ui/BackButton'
import MainTitle from '@/components/ui/MainTitle'
import FormattedDate from '@/components/ui/DateFormatter'
import CommentForm from '@/components/ui/CommentForm'
import Image from 'next/image'
import { gql } from '@apollo/client'
import { COMMENT_FRAGMENT } from '@/components/ui/Comment'
import { getCurrentUser } from '@/fetcher'
import CommentListContainer from '@/components/ui/CommentListContainer'

type PostContentProps = {
  post: PostFragment,
}

export const POST_FRAGMENT = gql`
  fragment Post on Post {
    id
    title
    content
    thumbnailUrl
    createdAt
  }
  ${COMMENT_FRAGMENT}
`

export default async function PostContent({ post }: PostContentProps) {
  const currentUser = await getCurrentUser() as User | null;

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

      <CommentForm postId={post.id} currentUser={currentUser} />
      <CommentListContainer postId={post.id} />
    </article>
  )
}
