import { NextRequest, NextResponse } from 'next/server';
import { setFlash } from '@/actions/flash';
import { getClient } from '@/app/apollo-client';
import { cookies } from 'next/headers';
import { ConfirmRegistrationDocument } from '@/app/graphql/generated';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  let result;

  try {
    result = await getClient().mutate({
      mutation: ConfirmRegistrationDocument,
      variables: { token: token }
    });
  } catch (err) {
    await setFlash({
      type: 'error',
      message: (err as Error).message
    });
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (result.data?.confirmRegistration?.errors) {
    console.log(result.data.confirmRegistration.errors);
    await setFlash({
      type: 'error',
      message: result.data.confirmRegistration.errors.map(error => error.message).join('\n')
    });
    return NextResponse.redirect(new URL('/', request.url));

  } else {
    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

    const cookieStore = await cookies();
    cookieStore.set('ss_sid', result.data?.confirmRegistration?.token || '', {
      expires: new Date(Date.now() + ONE_YEAR_MS),
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });

    await setFlash({
      type: 'success',
      message: '会員登録が完了しました。'
    });

    return NextResponse.redirect(new URL('/account', request.url));
  }
}
