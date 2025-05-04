'use server';

import { cookies } from 'next/headers';
import { apolloClient } from '@/app/graphql';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '@/app/graphql/auth/mutations';
import { redirect } from 'next/navigation';
import { User } from '@/app/types';

export type LoginResult = {
  success: boolean;
  error?: string;
  user?: User;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    // サーバーサイドからの認証リクエストにはCookieヘッダーを含める必要がある
    // これによりセッションが維持される
    const cookiesObj = cookies();
    const cookieHeader = cookiesObj.toString();

    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      context: {
        headers: {
          Cookie: cookieHeader,
        },
      },
    });

    if (data?.login?.user) {
      return {
        success: true,
        user: data.login.user
      };
    }

    return {
      success: false,
      error: 'ログインに失敗しました'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ログイン中にエラーが発生しました'
    };
  }
}

export async function logout() {
  try {
    // ログアウト時にも現在のCookieを含める必要がある
    const cookiesObj = cookies();
    const cookieHeader = cookiesObj.toString();

    await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      context: {
        headers: {
          Cookie: cookieHeader,
        },
      },
    });

    // クッキーはRailsのGraphQLエンドポイントで自動的に削除される
    redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}
