import { getPost } from '../fetcher';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import FormattedDate from '@/components/ui/DateFormatter/FormattedDate';
import MainTitle from '@/components/ui/MainTitle/MainTitle';
import BackButton from '@/components/ui/BackButton/BackButton';

type Params = {
  params: Promise<{ id: string }>
}

export default async function page({ params }: Params) {
  const { id } = await params;
  const post = await getPost(id);

  if(!post.ok) {
    notFound();
  }
  const postJson = await post.json();

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <BackButton>
          ← 戻る
        </BackButton>
        <MainTitle>{postJson.title}</MainTitle>
        <FormattedDate date={postJson.created_at} />
      </div>

      {postJson.thumbnail_url && (
        <div className={styles.thumbnailContainer}>
          <Image
            src={postJson.thumbnail_url}
            alt={postJson.title}
            fill
            className={styles.thumbnail}
            priority
            unoptimized={true}
          />
        </div>
      )}

      <div className={styles.content}>
        {postJson.content}
      </div>
    </article>
  )
}
