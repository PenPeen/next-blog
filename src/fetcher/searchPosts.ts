import { apolloClient } from '@/app/graphql';
import { cache } from 'react';
import { gql } from '@apollo/client';
import { POSTS_FRAGMENT } from "@/components/ui/Posts";

export const SEARCH_POSTS_QUERY = gql`
  ${POSTS_FRAGMENT}
  query SearchPosts($title: String!, $page: Int, $perPage: Int) {
    searchPosts(title: $title, page: $page, perPage: $perPage) {
      posts {
        ...postsTopFragment
      }
      pagination {
        totalCount
        limitValue
        totalPages
        currentPage
      }
    }
  }
`;

export const searchPosts = cache(async (title: string, page = 1, perPage = 15) => {
  const { data } = await apolloClient.query({
    query: SEARCH_POSTS_QUERY,
    variables: { title, page, perPage }
  });
  return { json: () => Promise.resolve(data.searchPosts) };
});
