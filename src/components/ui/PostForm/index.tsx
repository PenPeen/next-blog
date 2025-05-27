'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './PostForm.module.css';
import FormInput from '@/components/ui/FormInput';
import FormDropdown from '@/components/ui/FormDropdown';
import Button from '@/components/ui/Button';
import ThumbnailFileInput from '@/components/ui/ThumbnailFileInput';
import { gql } from '@apollo/client';
import PostFormSkeleton from '@/components/ui/PostFormSkeleton';
import { PostFormData, postSchema } from '@/lib/schema/post';

export const POST_FORM_FRAGMENT = gql`
  fragment POST_FORM_FRAGMENT on Post {
    id
    title
    content
    published
    thumbnailUrl
  }
`;

const statusOptions = [
  { value: 'draft', label: '下書き' },
  { value: 'published', label: '公開' }
];

type PostFormProps = {
  defaultValues: {
    title: string;
    content: string;
    status: string;
    thumbnailUrl?: string | null;
  };
  onSubmit: (data: PostFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  message?: string;
  errorMessage?: string;
};

export default function PostForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  message,
  errorMessage
}: PostFormProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues,
    mode: "onBlur"
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
      setIsInitialized(true);
    }
  }, [defaultValues, methods]);

  if (!isInitialized) {
    return <PostFormSkeleton />;
  }

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
              previewUrl={defaultValues.thumbnailUrl || undefined}
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
              {submitButtonText}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
