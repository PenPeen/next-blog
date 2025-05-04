'use server';

import { apolloClient } from '@/app/graphql';
import { CREATE_USER_MUTATION } from '@/app/graphql/auth/mutations';

export type RegisterResult = {
  success: boolean;
  error?: string;
};

export async function register(name: string, email: string, password: string): Promise<RegisterResult> {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: {
        userInput: { name, email, password }
      }
    });

    if (data?.createUser?.user) {
      return { success: true };
    }

    return {
      success: false,
      error: data?.createUser?.message || '登録に失敗しました'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
    };
  }
}
