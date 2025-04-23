import Card from "@/components/ui/Card/Card";
import styles from './page.module.css';
import Link from "next/link";
import { getPosts } from "@/app/(public)/posts/fetcher";
import { Post, PostsResponse } from "../types";
import { Pagination } from "@/components/ui/Pagination/Pagination";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const currentPage = Number(queryParams.page) || 1;
  const perPage = 15;

  const postsData = await getPosts(currentPage, perPage);
  const { posts, pagination } = await postsData.json() as PostsResponse;

  return (
    <div>
      <div className={styles.cardContainer}>
        {posts.map((post: Post) => {
          return(
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
          )
        })}
      </div>

      <Pagination
        totalCount={pagination.totalCount}
        limitValue={pagination.limitValue}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
      />
    </div>
  );
}
