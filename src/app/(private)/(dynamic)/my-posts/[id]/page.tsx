import { getMyPost } from '@/fetcher';
import { notFound } from 'next/navigation';

type Params = {
  params: { id: string }
}

export async function fetchMyPost(id: string) {
  const data = await getMyPost(id);
  const post = await data.json();

  if (!post) {
    notFound();
  }

  return post;
}

export async function generateMetadata({ params }: Params) {
  const parameters = await params;
  const post = await fetchMyPost(parameters.id);

  return {
    title: post.title,
  };
}

export default async function MyPostPage({ params }: Params) {
  const parameters = await params;
  const post = await fetchMyPost(parameters.id);

  // TODO: 投稿編集機能の実装
  return (
    <>
      {post.title}<br />
      {post.content}<br />
      {post.published ? '公開中' : '非公開'}
    </>
  );
}
