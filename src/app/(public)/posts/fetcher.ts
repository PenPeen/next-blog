import { GET_PUBLISHED_POSTS, GET_POST } from '@/app/graphql/posts/queries';
import { apolloClient } from '@/app/graphql/apollo-client';
import { Post, PostsResponse } from '@/app/types';

export async function getPosts(params: { first?: number; after?: string; last?: number; before?: string } = { first: 15 }) {
  const { data } = await apolloClient.query({
    query: GET_PUBLISHED_POSTS,
    variables: params
  });
  return { json: () => Promise.resolve(data.posts as PostsResponse) };
};

export async function getPost(id: string) {
  const { data } = await apolloClient.query({
    query: GET_POST,
    variables: { id }
  });
  return { json: () => Promise.resolve(data.post as Post) };
}
