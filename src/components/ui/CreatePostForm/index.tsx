'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/ui/PostForm';
import { makeClient } from '@/app/ApolloWrapper';
import { setFlash } from '@/actions/flash';
import { CreatePostDocument } from '@/app/graphql/generated';
import { PostFormData } from '@/lib/schema/post';

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

      const client = makeClient();
      const { data: responseData } = await client.mutate({
        mutation: CreatePostDocument,
        variables: {
          input: {
            postInput: {
              title: data.title,
              content: data.content,
              published: data.status === 'published',
              thumbnail
            }
          }
        }
      });

      if (responseData?.createPost?.errors) {
        setErrorMessage(responseData.createPost.errors.map((error: { message: string }) => error.message).join('\n'));
      } else {
        if (responseData?.createPost?.post) {
          await setFlash({
            message: '記事を作成しました',
            type: 'success'
          });
          router.push(`/account/my-posts/${responseData.createPost.post.id}`);
        }
      }
    } catch (error) {
      console.error('作成エラー:', error);
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
