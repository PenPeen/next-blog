'use server';

import { apolloClient, LoginDocument } from '@/app/graphql';
import { cookies } from 'next/headers';
import { ApolloError } from '@apollo/client';
import { setFlash } from '@/actions/setFlash';

type LoginResponse = {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

const loginProcessingError = 'ログイン処理中にエラーが発生しました。再度お試しください。'

export async function login(formData: FormData): Promise<LoginResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const cookieHeader = await cookies();
    const cookie = cookieHeader.toString();

    const { data } = await apolloClient.mutate({
      mutation: LoginDocument,
      variables: { email, password },
      context: {
        headers: {
          Cookie: cookie,
        },
      },
    });

    if (data?.login?.token) {
      const cookieStore = await cookies();
      cookieStore.set('ss_sid', data?.login?.token || '', {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      });

      await setFlash({
        type: 'success',
        message: 'ログインしました'
      });

      return { success: true, redirectUrl: '/account' };
    } else {
      throw new Error(loginProcessingError);
    }

  } catch (error) {
    let errorMessage;
    if (error instanceof ApolloError) {
      errorMessage = error.message;
    } else {
      errorMessage = loginProcessingError
    }

    await setFlash({
      type: 'error',
      message: errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
