'use client';

import React, { useState } from 'react';
import { makeClient } from '@/app/ApolloWrapper';
import { UpdatePostDocument } from '@/app/graphql/generated';
import { useRouter } from 'next/navigation';
import PostForm, { PostFormData } from '@/components/ui/PostForm';

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
      const client = makeClient();

      let thumbnail = undefined;
      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        const reader = new FileReader();
        thumbnail = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      }

      const { data: responseData } = await client.mutate({
        mutation: UpdatePostDocument,
        variables: {
          input: {
            postInput: {
              id: post.id,
              title: data.title,
              content: data.content,
              published: data.status === 'published',
              thumbnail
            }
          }
        }
      });

      if (responseData?.updatePost?.errors) {
        setErrorMessage(responseData.updatePost.errors.map((error: { message: string }) => error.message).join('\n'));
      } else {
        if (responseData?.updatePost?.post) {
          setMessage('投稿を更新しました');
          router.refresh();
        }
      }
    } catch (error) {
      console.error('更新エラー:', error);
      setErrorMessage('更新中にエラーが発生しました。しばらく経ってから再度試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
