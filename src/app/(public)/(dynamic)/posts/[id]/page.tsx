import PostContent from '@/components/ui/PostContent';
import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: Promise<{ id: string }>
}

async function fetchPost(id: string) {
  const data = await getPost(id);
  const post = await data.json();
  return post;
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
