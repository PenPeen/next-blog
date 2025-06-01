'use server';

import { LoginDocument } from '@/app/graphql';
import { cookies } from 'next/headers';
import { setFlash } from '@/actions/flash';
import { redirect } from 'next/navigation';
import { getClient } from '@/app/apollo-client';
import { LoginFormData } from '@/lib/schema/login';

export async function login(formData: LoginFormData) {
  const email = formData.email;
  const password = formData.password;

  const cookieHeader = await cookies();
  const cookie = cookieHeader.toString();

  const { data } = await getClient().mutate({
    mutation: LoginDocument,
    variables: { email, password },
    context: {
      headers: {
        Cookie: cookie,
      },
    },
  });

  if (!data || !data.login) {
    throw new Error('ログインに失敗しました。しばらく経ってから再度試してください。');
  }

  if (data?.login?.errors) {
    await setFlash({
      type: 'error',
      message: data.login.errors.map(error => error.message).join('\n')
    });

    redirect('/signin');
  } else {
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

    redirect('/account');
  }
}
