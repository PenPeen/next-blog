'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/ui/PostForm';
import DeletePostForm from '@/components/ui/DeletePostForm';
import styles from './EditPostForm.module.css';
import { PostFormData } from '@/lib/schema/post';
import { updatePost } from '@/mutations/updatePost';

type PostType = {
  id: string;
  title: string;
  content: string;
  published?: boolean | null;
  thumbnailUrl?: string | null;
}

type EditPostFormProps = {
  post: PostType;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setMessage('');
    setErrorMessage('');

    try {
      const responseData = await updatePost(post.id, data);

      if (responseData.errors) {
        setErrorMessage(responseData.errors.map((error: { message: string }) => error.message).join('\n'));
      } else if (responseData.post) {
        setMessage('投稿を更新しました');
        router.refresh();
      }
    } catch {
      setErrorMessage('更新中にエラーが発生しました。しばらく経ってから再度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <PostForm
        defaultValues={{
          title: post.title,
          content: post.content,
          status: post.published ? 'published' : 'draft',
          thumbnailUrl: post.thumbnailUrl
        }}
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? '更新中...' : '更新する'}
        isSubmitting={isSubmitting}
        message={message}
        errorMessage={errorMessage}
      />

      <div className={styles.dangerZone}>
        <DeletePostForm post={post} />
      </div>
    </div>
  );
}
