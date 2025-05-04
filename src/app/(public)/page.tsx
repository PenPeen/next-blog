import Card from "@/components/ui/Card";
import styles from './page.module.css';
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { getPosts, searchPosts } from "@/app/(public)/posts/fetcher";
import { PostsResponse, Post } from "../types";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    title?: string;
  }>;
};

export default async function Home({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const currentPage = Number(queryParams.page) || 1;
  const perPage = 15;
  const titleQuery = queryParams.title || '';

  const data = titleQuery
    ? await searchPosts(titleQuery, currentPage, perPage )
    : await getPosts(currentPage, perPage);

  const res = await data.json() as PostsResponse;

  return (
    <div>
      {titleQuery && (
        <h1 className={styles.searchResults}>「{titleQuery}」の検索結果</h1>
      )}

      {res.posts.length === 0 && titleQuery && (
        <p className={styles.noResults}>検索結果が見つかりませんでした。別のキーワードをお試しください。</p>
      )}

      <div className={styles.cardContainer}>
        {res.posts.map((post: Post) => {
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

      <Pagination
        totalCount={res.pagination.totalCount}
        limitValue={res.pagination.limitValue}
        totalPages={res.pagination.totalPages}
        currentPage={res.pagination.currentPage}
      />
    </div>
  );
}
