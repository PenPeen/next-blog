'use server';

import { apolloClient } from '@/app/graphql';
import { cookies } from 'next/headers';
import { UPDATE_USER_PROFILE } from '@/graphql/mutations/updateUserProfile';
import { setFlash } from './flash';

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
      mutation: UPDATE_USER_PROFILE,
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

    setFlash({
      message: responseData.updateUserProfile.message,
      type: 'success',
    });

    return { success: true };
  } catch(error: unknown) {
    if (error instanceof Error) {
      setFlash({
        message: error.message,
        type: 'error',
      });
    }
    return { success: false };
  }
}
