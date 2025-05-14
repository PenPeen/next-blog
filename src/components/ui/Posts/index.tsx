import { PostsTopFragmentFragment } from "@/app/graphql";
import Link from "next/link";
import Card from "@/components/ui/Card";
import styles from './Posts.module.css';
import { gql } from '@apollo/client';

export const POSTS_FRAGMENT = gql`
  fragment postsTopFragment on Post {
    id
    title
    content
    thumbnailUrl
  }
`;

type PostsProps = {
  posts: PostsTopFragmentFragment[] | null | undefined;
}

export default function Posts({ posts }: PostsProps) {
  return (
    <div className={styles.cardContainer}>
      {posts?.map((post) => {
        return(
          <Link href={`/posts/${post.id}`} key={post.id}>
            <Card
              img={post.thumbnailUrl || '/default-thumbnail.png'}
              title={post.title}
              description={post.content}
              variant="post"
              unoptimized={true}
              maxLines={3}
              titleMaxLines={true}
            />
          </Link>
        )
      })}
    </div>
  )
}
