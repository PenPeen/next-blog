'use server'

import { apolloClient, CreateUserDocument } from '@/app/graphql';
import { setFlash } from './flash';
import { redirect } from 'next/navigation';

type FormData = {
  name: string;
  email: string;
  password: string;
}

export const register = async (formData: FormData) => {
  const { data } = await apolloClient.mutate({
    mutation: CreateUserDocument,
    variables: {
      userInput: { name: formData.name, email: formData.email, password: formData.password }
    }
  });

  await setFlash({
    message: `${data!.createUser!.user!.email}宛に確認メールを送信しました。`,
    type: "success"
  });

  redirect('/');
};
