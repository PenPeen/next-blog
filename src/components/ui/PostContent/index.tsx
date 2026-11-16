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
import TableOfContents from '@/components/ui/TableOfContents'
import { splitByHeadings } from '@/lib/postHeadings'

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
  const blocks = splitByHeadings(post.content);
  const headings = blocks.filter((block) => block.type === 'heading');

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

      <TableOfContents headings={headings} />

      <div className={styles.content}>
        {blocks.map((block, index) => {
          if (block.type === 'text') {
            return <p key={index}>{block.text}</p>
          }
          const HeadingTag = `h${block.level + 1}` as 'h2' | 'h3' | 'h4'
          return (
            <HeadingTag key={block.id} id={block.id} className={styles.heading}>
              {block.text}
            </HeadingTag>
          )
        })}
      </div>

      <CommentForm postId={post.id} currentUser={currentUser} />
      <CommentListContainer postId={post.id} />
    </article>
  )
}
