import CreatePostForm from '@/components/ui/CreatePostForm';
import BackButton from '@/components/ui/BackButton';
import MainTitle from '@/components/ui/MainTitle';
import Card from '@/components/ui/Card';
import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "新規記事作成",
  description: "記事を新規作成",
};

export default function NewPostPage() {
  return (
    <div className={styles.container}>
      <BackButton>← 投稿一覧に戻る</BackButton>
      <MainTitle>新規記事作成</MainTitle>
      <Card variant="post">
        <CreatePostForm />
      </Card>
    </div>
  );
}
