'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './CommentForm.module.css';
import Button from '@/components/ui/Button';
import { CommentFormData, commentSchema } from '@/lib/schema/comment';
import { User } from '@/app/graphql/generated';
import { createComment } from '@/actions/createComment';
import { useRouter } from 'next/navigation';

type CommentFormProps = {
  postId: string;
  currentUser: User | null;
};

export default function CommentForm({
  postId,
  currentUser,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    mode: 'onBlur',
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', data.content);

    const result = await createComment(formData);
    if (result.success) {
      methods.reset({ content: '' });
    }

    setIsSubmitting(false);
    router.refresh();
  };

  const isAuthenticated = !!currentUser;

  return (
    <div className={styles.formContainer}>
      <FormProvider {...methods}>
        <form className={styles.form} onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={styles.textareaContainer}>
            <label htmlFor="content" className={styles.label}>
              コメントを投稿
            </label>
            <textarea
              id="content"
              data-testid="comment-textarea"
              {...methods.register('content')}
              className={styles.textarea}
              placeholder={isAuthenticated ? 'コメントを入力してください' : 'コメントを投稿するにはログインが必要です'}
              disabled={!isAuthenticated || isSubmitting}
            />
            {methods.formState.errors.content && (
              <p className={styles.errorMessage}>
                {methods.formState.errors.content.message}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              buttonType="submit"
              isSolid
              isRadius
              isDisabled={!isAuthenticated || isSubmitting}
            >
              {isSubmitting ? '送信中...' : 'コメントを投稿'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
