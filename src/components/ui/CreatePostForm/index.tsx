'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/ui/PostForm';
import { setFlash } from '@/actions/flash';
import { PostFormData } from '@/lib/schema/post';
import { createPost } from '@/mutations/createPost';

export default function CreatePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const defaultValues = {
    title: '',
    content: '',
    status: 'draft',
    thumbnailUrl: null
  };

  const handleSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    setMessage('');
    setErrorMessage('');

    try {
      const responseData = await createPost(data);

      if (responseData.errors) {
        setErrorMessage(responseData.errors.map((error: { message: string }) => error.message).join('\n'));
      } else {
        if (responseData.post) {
          await setFlash({
            message: '記事を作成しました',
            type: 'success'
          });
          router.push(`/account/my-posts/${responseData.post.id}`);
        }
      }
    } catch {
      setErrorMessage('作成中にエラーが発生しました。しばらく経ってから再度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitButtonText={isSubmitting ? '作成中...' : '作成する'}
      isSubmitting={isSubmitting}
      message={message}
      errorMessage={errorMessage}
    />
  );
}
