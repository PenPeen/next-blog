import React from 'react'
import { Post } from '@/app/graphql'
import styles from './PostContent.module.css'
import BackButton from '@/components/ui/BackButton'
import MainTitle from '@/components/ui/MainTitle'
import FormattedDate from '@/components/ui/DateFormatter'
import Image from 'next/image'
import { gql } from '@apollo/client'

type PostContentProps = {
  post: Post
}

export const POST_FRAGMENT = gql`
  fragment postFragment on Post {
    title
    content
    thumbnailUrl
    createdAt
  }
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
    </article>
  )
}
