'use server';

import { apolloClient, UpdateUserProfileDocument } from '@/app/graphql';
import { cookies } from 'next/headers';
import { setFlash } from './flash';
import { redirect } from 'next/navigation';

type ProfileFormData = {
  name: string;
  profileImage?: FileList;
};

export async function updateProfile(data: ProfileFormData) {
  try {
    let profileImageBase64 = null;
    if (data.profileImage && data.profileImage.length > 0) {
      const file = data.profileImage[0];
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      profileImageBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const cookiesObj = await cookies();
    const cookieHeader = cookiesObj.toString();

    const { data: responseData } = await apolloClient.mutate({
      mutation: UpdateUserProfileDocument,
      context: {
        headers: {
          Cookie: cookieHeader,
        },
      },
      variables: {
        input: {
          userProfileInput: {
            name: data.name,
            profile: profileImageBase64,
          }
        }
      }
    });

    if (responseData?.updateUserProfile?.errors) {
      await setFlash({
        message: responseData.updateUserProfile.errors.map(error => error.message).join('\n'),
        type: 'error',
      });
    } else {
      await setFlash({
        message: 'プロフィールを更新しました',
        type: 'success',
      });
    }
  } catch(error: unknown) {
    if (error instanceof Error) {
      await setFlash({
        message: error.message,
        type: 'error',
      });
    }
  }

  return redirect('/account/profile');
}
