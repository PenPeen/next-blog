import { GetMyPostsDocument } from '@/app/graphql/generated';
import { query } from '@/app/apollo-client';
import { cookies } from "next/headers";
import { cache } from 'react';

export const getMyPosts = cache(async (page = 1, perPage = 15) => {
  const cookiesObj = await cookies();
  const cookieHeader = cookiesObj.toString();

  const { data } = await query({
    query: GetMyPostsDocument,
    variables: { page, perPage },
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });
  return { json: () => Promise.resolve(data.myPosts) };
});
