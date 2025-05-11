import PostContent from '@/components/ui/PostContent';
import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>
}

export default async function page({ params }: Params) {
  const { id } = await params;
  const data = await getPost(id);
  const post = await data.json();

  if(!post) {
    notFound();
  }

  return (
    <PostContent post={post} />
  )
}
