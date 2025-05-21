'use server'

import { CreateUserDocument } from '@/app/graphql';
import { setFlash } from './flash';
import { redirect } from 'next/navigation';
import { getClient } from '@/app/apollo-client';

type FormData = {
  name: string;
  email: string;
  password: string;
}

export const register = async (formData: FormData) => {
  const { data } = await getClient().mutate({
    mutation: CreateUserDocument,
    variables: {
      userInput: { name: formData.name, email: formData.email, password: formData.password }
    }
  });

  if (data?.createUser?.errors) {
    await setFlash({
      type: 'error',
      message: data.createUser.errors.map(error => error.message).join('\n')
    });
    return redirect('/register');

  } else {
    await setFlash({
      message: `${data!.createUser!.user!.email}宛に確認メールを送信しました。`,
      type: "success"
    });
    return redirect('/');
  }
};
