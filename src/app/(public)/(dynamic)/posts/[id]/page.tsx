import { getPost } from '@/fetcher';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import FormattedDate from '@/components/ui/DateFormatter';
import MainTitle from '@/components/ui/MainTitle';
import BackButton from '@/components/ui/BackButton';

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
    <article className={styles.container}>
      <div className={styles.header}>
        <BackButton>
          ← 戻る
        </BackButton>
        <MainTitle>{post.title}</MainTitle>
        <FormattedDate date={post.createdAt} />
      </div>

      {post.thumbnailUrl && (
        <div className={styles.thumbnailContainer}>
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className={styles.thumbnail}
            priority
            unoptimized={true}
          />
        </div>
      )}

      <div className={styles.content}>
        {post.content}
      </div>
    </article>
  )
}
