import PostContent from '@/components/ui/PostContent';
import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const data = await getPost(id);
  const post = data.published.post;

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
  const data = await getPost(id);
  const post = data.published.post;

  if(!post) {
    notFound();
  }

  return (
    <PostContent post={post}/>
  )
}
