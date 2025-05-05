import styles from './page.module.css';
import { Pagination } from "@/components/ui/Pagination";
import { getPosts, searchPosts } from "@/app/(public)/posts/fetcher";
import Posts from "@/components/ui/Posts";
import { Post } from '@/app/graphql';

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

  const { posts, pagination } = await data.json();

  return (
    <div>
      {titleQuery && (
        <h1 className={styles.searchResults}>「{titleQuery}」の検索結果</h1>
      )}

      {posts === null && titleQuery && (
        <p className={styles.noResults}>検索結果が見つかりませんでした。別のキーワードをお試しください。</p>
      )}

      {posts && (
        <Posts posts={posts as Post[]} />
      )}

      {pagination && (
        <Pagination
          totalCount={pagination.totalCount ?? 0}
          limitValue={pagination.limitValue ?? 0}
          totalPages={pagination.totalPages ?? 0}
          currentPage={pagination.currentPage ?? 0}
        />
      )}
    </div>
  );
}
