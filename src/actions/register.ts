'use server'

import { apolloClient, CreateUserDocument } from '@/app/graphql';
import { ApolloError } from '@apollo/client';
import { setFlash } from './flash';

type FormData = {
  name: string;
  email: string;
  password: string;
}

export const register = async (formData: FormData) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CreateUserDocument,
      variables: {
        userInput: { name: formData.name, email: formData.email, password: formData.password }
      }
    });

      await setFlash({
        message: `${data?.createUser?.user?.email}宛に確認メールを送信しました。`,
        type: "success"
      });

      return { success: true, redirectUrl: '/' };
  } catch (error: unknown) {
    let errorMessage;
    if (error instanceof ApolloError) {
      errorMessage = error.message;
    } else {
      errorMessage = '予期せぬエラーが発生しました';
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
};
