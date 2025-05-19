import MyPostsList from '@/components/ui/MyPostsList';
import { Metadata } from 'next';
type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Account",
  description: "Account of PenBlog App",
};

export default async function AccountPage({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const currentPage = Number(queryParams.page) || 1;
  const perPage = 15;

  return (
    <>
      <MyPostsList currentPage={currentPage} perPage={perPage} />
    </>
  )
}
