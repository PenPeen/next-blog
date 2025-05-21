'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from './MyPostForm.module.css';
import FormInput from '@/components/ui/FormInput';
import FormDropdown from '@/components/ui/FormDropdown';
import Button from '@/components/ui/Button';
import { gql } from '@apollo/client';
import { makeClient } from '@/app/ApolloWrapper';
import { UpdatePostDocument } from '@/app/graphql/generated';
import { useRouter } from 'next/navigation';
import ThumbnailFileInput from '@/components/ui/ThumbnailFileInput';

export const MY_POST_FORM_FRAGMENT = gql`
  fragment MY_POST_FORM_FRAGMENT on Post {
    id
    title
    content
    published
    thumbnailUrl
  }
`

type PostType = {
  id: string;
  title: string;
  content: string;
  published?: boolean | null;
  thumbnailUrl?: string | null;
}

type MyPostFormProps = {
  post: PostType;
}

const postSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "内容は必須です"),
  status: z.string().min(1, "公開状態は必須です"),
  thumbnail: z.any().optional().refine(
    (files) => {
      if (!files) return true;
      if (files.length === 0) return true;
      if (files.length === 1 && files[0].size <= 2 * 1024 * 1024) return true;
      return false;
    },
    { message: "画像サイズは2MB以下にしてください" }
  )
});

type PostFormData = z.infer<typeof postSchema>;

const statusOptions = [
  { value: 'draft', label: '下書き' },
  { value: 'published', label: '公開' }
];

export default function MyPostForm({ post }: MyPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const methods = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      status: post.published ? 'published' : 'draft',
    },
    mode: "onBlur"
  });

  const onSubmit = async (data: PostFormData) => {
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
    <div className={styles.container}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={styles.header}>
            <FormInput
              name="title"
              label="タイトル"
              placeholder="タイトルを入力"
              required
            />
            <div className={styles.statusContainer}>
              <FormDropdown
                name="status"
                label="公開状態"
                options={statusOptions}
                required
              />
            </div>
          </div>

          <div className={styles.thumbnailContainer}>
            <ThumbnailFileInput
              name="thumbnail"
              label="サムネイル画像"
              helpText="JPG, PNG, GIF (最大2MB)"
              previewUrl={post.thumbnailUrl || undefined}
            />
          </div>

          <div className={styles.content}>
            <label htmlFor="content" className={styles.fieldLabel}>
              内容
              <span className={styles.requiredMark}>*</span>
            </label>
            <textarea
              id="content"
              data-testid="content-textarea"
              {...methods.register("content")}
              placeholder="内容を入力"
              className={styles.contentField}
              rows={12}
              required
            />
            {methods.formState.errors.content && (
              <p className={styles.errorMessage}>
                {methods.formState.errors.content.message}
              </p>
            )}
          </div>

          {message && <div className={styles.message}>{message}</div>}
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

          <div className={styles.actions}>
            <Button
              type="primary"
              buttonType="submit"
              isSolid
              isRadius
              isDisabled={isSubmitting}
            >
              {isSubmitting ? '更新中...' : '更新する'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
