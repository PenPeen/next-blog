import EditPostForm from '@/components/ui/EditPostForm';
import { getMyPost } from '@/fetcher';
import { notFound } from 'next/navigation';
import MainTitle from '@/components/ui/MainTitle';
import Card from '@/components/ui/Card';
import BackButton from '@/components/ui/BackButton';
import styles from './page.module.css';

type Params = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: Params) => {
  const { id } = await params;
  const post = await getMyPost(id);
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.content.slice(0, 100),
  }
}

export default async function MyPostPage({ params }: Params) {
  const { id } = await params;
  const post = await getMyPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <BackButton>← 投稿一覧に戻る</BackButton>
      <MainTitle>投稿の編集</MainTitle>
      <Card variant="post">
        <EditPostForm post={post} />
      </Card>
    </div>
  );
}
