import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';
import Link from "next/link";
import { getPosts } from "@/app/(public)/posts/fetcher";
import { PostsResponse } from "../types";

type PageProps = {
  searchParams: Promise<{
    cursor?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const cursor = queryParams.cursor || undefined;

  const data = await getPosts({ first: 15, after: cursor });
  const posts = await data.json() as PostsResponse;

  return (
    <div>
      <div className={styles.cardContainer}>
        {posts.edges.map(({ node: post }) => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <Card
              img={post.thumbnailUrl}
              title={post.title}
              description={post.content}
              variant="post"
              unoptimized={true}
              maxLines={3}
              titleMaxLines={true}
            />
          </Link>
        ))}
      </div>

      <div className={styles.paginationContainer}>
        {posts.pageInfo.hasPreviousPage && (
          <Link href={`/?cursor=${posts.pageInfo.startCursor}`} className={styles.paginationLink}>
            前のページ
          </Link>
        )}
        {posts.pageInfo.hasNextPage && (
          <Link href={`/?cursor=${posts.pageInfo.endCursor}`} className={styles.paginationLink}>
            次のページ
          </Link>
        )}
      </div>
    </div>
  );
}
