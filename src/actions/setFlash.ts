'use server';

import { cookies } from 'next/headers';

export type FlashType = 'success' | 'error' | 'warning';

export type Flash = {
  type: FlashType;
  message: string;
};

export async function setFlash(flash: Flash) {
  const cookieStore = await cookies();
  cookieStore.set("flash", JSON.stringify(flash), {
    path: "/",
    maxAge: 1, // 本来は0秒で指定したかったが、正常動作しなかったため1秒を指定
  });
}
