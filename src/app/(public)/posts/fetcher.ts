import { GET_PUBLISHED_POSTS } from '@/app/graphql/posts/queries';
import { apolloClient } from '@/app/graphql/apollo-client';
import { Post } from '@/app/types';

export async function getPosts(page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: GET_PUBLISHED_POSTS,
    variables: { page, perPage }
  });
  return { json: () => Promise.resolve(data.publishedPosts as Post[]) };
};
