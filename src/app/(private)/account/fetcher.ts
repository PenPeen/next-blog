import { GET_MY_POSTS } from '@/app/graphql/posts/queries';
import { apolloClient } from '@/app/graphql/apollo-client';
import { PostsResponse } from '@/app/types';
import { cookies } from "next/headers";

export async function getMyPosts(page = 1, perPage = 15) {
  const cookiesObj = await cookies();
  const cookieHeader = cookiesObj.toString();

  const { data } = await apolloClient.query({
    query: GET_MY_POSTS,
    variables: { page, perPage },
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });
  return { json: () => Promise.resolve(data.myPosts as PostsResponse) };
};
