import PostContent from '@/components/ui/PostContent';
import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>
}

async function fetchPost(id: string) {
  const data = await getPost(id);
  return await data.json();
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title}`,
    description: post.content.slice(0, 100),
  };
}

export default async function PostPage({ params }: Params) {
  const { id } = await params;
  const post = await fetchPost(id);

  if(!post) {
    notFound();
  }

  return (
    <PostContent post={post} />
  )
}
