import { GetMyPostsDocument } from '@/app/graphql';
import { apolloClient } from '@/app/graphql/apollo-client';
import { cookies } from "next/headers";

export async function getMyPosts(page = 1, perPage = 15) {
  const cookiesObj = await cookies();
  const cookieHeader = cookiesObj.toString();

  const { data } = await apolloClient.query({
    query: GetMyPostsDocument,
    variables: { page, perPage },
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });
  return { json: () => Promise.resolve(data.myPosts) };
};
