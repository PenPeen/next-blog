import { apolloClient } from '@/app/graphql/apollo-client';
import { GetPostDocument, GetPostsDocument, SearchPostsDocument } from '@/app/graphql';

export async function getPosts(page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: GetPostsDocument,
    variables: { page, perPage }
  });
  return { json: () => Promise.resolve(data.posts) };
};

export async function getPost(id: string) {
  const { data } = await apolloClient.query({
    query: GetPostDocument,
    variables: { id }
  });
  return { json: () => Promise.resolve(data.post) };
}

export async function searchPosts(title: string, page = 1, perPage = 15) {
  const { data } = await apolloClient.query({
    query: SearchPostsDocument,
    variables: { title, page, perPage }
  });
  return { json: () => Promise.resolve(data.searchPosts) };
}
