'use client';

import { useState } from 'react';
import Modal from '../Modal';
import useModal from '../Modal/useModal';
import styles from './DeletePostForm.module.css';
import { useRouter } from 'next/navigation';
import { setFlash } from '@/actions/flash';
import { deletePost } from '@/mutations/deletePost';

type PostType = {
  id: string;
  title: string;
  content: string;
  published?: boolean | null;
  thumbnailUrl?: string | null;
}

type DeletePostFormProps = {
  post: PostType;
}

export default function DeletePostForm({ post }: DeletePostFormProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage('');
    setErrorMessage('');

    try {
      const data = await deletePost(post.id);

      if (data.errors) {
        setErrorMessage(data.errors.map((error: { message: string }) => error.message).join('\n'));
      } else if (data.success) {
        await setFlash({
          message: '投稿を削除しました',
          type: 'success'
        });
        router.push('/account');
      }
    } catch {
      setErrorMessage('削除中にエラーが発生しました。しばらく経ってから再度試してください。');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>投稿を削除</h3>
        <p className={styles.description}>この操作は取り消せません。削除すると、この投稿に関連するすべてのデータが削除されます。</p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.deleteButton}
          onClick={openModal}
        >
          投稿を削除する
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${styles.successMessage}`}>
          {message}
        </div>
      )}

      {errorMessage && (
        <div className={`${styles.message} ${styles.errorMessage}`}>
          {errorMessage}
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="投稿を削除しますか？"
        size="medium"
      >
        <p>「{post.title}」を削除しますか？この操作は取り消せません。</p>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={closeModal}
          >
            キャンセル
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : '削除する'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
