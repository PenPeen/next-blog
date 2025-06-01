import styles from './page.module.css';
import { Pagination } from "@/components/ui/Pagination";
import { getPublishedPosts, getPublishedSearchPosts } from "@/fetcher";
import Posts from "@/components/ui/Posts";
import FlashMessage from '@/components/ui/FlashMessage';
import { Metadata } from 'next';

type PageProps = {
  searchParams: Promise<{
    page?: string;
    title?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Posts',
  description: '最新の投稿記事一覧。様々なトピックに関する情報を見つけることができます。',
};

export default async function Home({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const currentPage = Number(queryParams.page) || 1;
  const perPage = 15;
  const titleQuery = queryParams.title || '';
  const data = titleQuery
    ? await getPublishedSearchPosts(titleQuery, currentPage, perPage )
    : await getPublishedPosts(currentPage, perPage);

  const { posts, pagination } = data;

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
