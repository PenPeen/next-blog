'use server';

import { cookies } from 'next/headers';
import { setFlash } from '@/actions/flash';
import { getClient } from '@/app/apollo-client';
import { CreateCommentDocument } from '@/app/graphql/generated';
import { revalidatePath } from 'next/cache';

type CreateCommentResult = {
  success: boolean;
}

export async function createComment(formData: FormData): Promise<CreateCommentResult> {
  const postId = formData.get('postId') as string;
  const content = formData.get('content') as string;

  if (!postId || !content.trim()) {
    await setFlash({
      type: 'error',
      message: 'コメント内容を入力してください'
    });
    return { success: false };
  }

  const cookieHeader = await cookies();
  const cookie = cookieHeader.toString();

  const { data } = await getClient().mutate({
    mutation: CreateCommentDocument,
    variables: { input: { postId, content } },
    context: {
      headers: {
        Cookie: cookie,
      },
    },
  });

  if(!data || !data.createComment) {
    await setFlash({
      type: 'error',
      message: 'コメントの投稿に失敗しました。後でもう一度お試しください。'
    });
    return { success: false };
  }

  if (!data.createComment.errors) {
    await setFlash({
      type: 'success',
      message: 'コメントを投稿しました'
    });

    revalidatePath(`/posts/${postId}`);
    return { success: true };
  } else {
    await setFlash({
      type: 'error',
      message: data.createComment.errors.map((error: { message: string }) => error.message).join('\n')
    });
    return { success: false };
  }
}
