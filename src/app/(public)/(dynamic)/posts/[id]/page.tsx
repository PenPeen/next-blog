import PostContent from '@/components/ui/PostContent';
import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>
}

async function fetchPost(id: string) {
  try {
    const data = await getPost(id);
    return await data.json();
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await fetchPost(id);

  return {
    title: `${post.title}`,
    description: "Post of PenBlog App",
  };
}

export default async function page({ params }: Params) {
  const { id } = await params;
  const post = await fetchPost(id);

  if(!post) {
    notFound();
  }

  return (
    <PostContent post={post} />
  )
}
