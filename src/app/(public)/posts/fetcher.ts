import { GET_POSTS, GET_POST, SEARCH_POSTS } from '@/app/graphql/posts/queries';
import { apolloClient } from '@/app/graphql/apollo-client';
import { Post, PostsResponse } from '@/app/types';

export async function getPosts(page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: GET_POSTS,
    variables: { page, perPage }
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

export async function searchPosts(title: string, page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: SEARCH_POSTS,
    variables: { title, page, perPage }
  });
  return { json: () => Promise.resolve(data.searchPosts as PostsResponse) };
}
