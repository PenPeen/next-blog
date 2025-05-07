'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// NOTE: ログイン判定はCookieで管理しているため、Cookieを削除することでログアウトする
// Rails側へのリクエストは発生しない。
export async function logout(): Promise<{ success: boolean }> {
    const cookieStore = await cookies();
    cookieStore.delete('ss_sid');

    redirect('/');
}
