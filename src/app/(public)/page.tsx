import styles from './page.module.css';
import { Pagination } from "@/components/ui/Pagination";
import { getPosts, searchPosts } from "@/fetcher";
import Posts from "@/components/ui/Posts";
import FlashMessage from '@/components/ui/FlashMessage';

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
    <>
      <FlashMessage />
      <div>
        {titleQuery && (
          <h1 className={styles.searchResults}>「{titleQuery}」の検索結果</h1>
        )}

        {posts && posts.length === 0 && titleQuery && (
          <p className={styles.noResults}>検索結果が見つかりませんでした。別のキーワードをお試しください。</p>
        )}

        {posts && (
          <Posts posts={posts} />
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
    </>
  );
}
