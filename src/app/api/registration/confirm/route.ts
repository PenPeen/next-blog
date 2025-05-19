import { NextRequest, NextResponse } from 'next/server';
import { setFlash } from '@/actions/flash';
import { apolloClient } from '@/app/graphql/apollo-client';
import { CONFIRM_REGISTRATION_MUTATION } from '@/app/graphql/operations/user/confirmRegistration';
import { cookies } from 'next/headers';
import { ApolloError } from '@apollo/client';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  try {
    const result = await apolloClient.mutate({
      mutation: CONFIRM_REGISTRATION_MUTATION,
      variables: { token }
    });

    const cookieStore = await cookies();
    cookieStore.set('ss_sid', result.data.confirmRegistration.token, {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });

    await setFlash({
      type: 'success',
      message: '会員登録が完了しました。'
    });
  } catch (err) {
    await setFlash({
      type: 'error',
      message: (err as ApolloError).message
    });
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.redirect(new URL('/account', request.url));
}
