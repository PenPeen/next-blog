'use server';

import { apolloClient, LoginDocument } from '@/app/graphql';
import { cookies } from 'next/headers';
import { setFlash } from '@/actions/flash';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

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
  }

  redirect('/account');
}
