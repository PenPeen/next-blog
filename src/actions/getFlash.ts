'use server';

import { cookies } from 'next/headers';
import { Flash } from './setFlash';

export async function getFlash(): Promise<Flash | null> {
  const cookieStore = await cookies();
  const flashCookie = cookieStore.get('flash');

  if (!flashCookie) {
    return null;
  }

  const flashData = JSON.parse(flashCookie.value) as Flash;
  return flashData;
}
