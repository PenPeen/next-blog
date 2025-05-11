import { apolloClient } from "@/app/graphql";
import { cache } from "react";
import { gql } from "@apollo/client";
import { POSTS_FRAGMENT } from "@/components/ui/Posts";

export const GET_POSTS_QUERY = gql`
  ${POSTS_FRAGMENT}
  query FetchPublishedPosts($page: Int, $perPage: Int) {
    posts(page: $page, perPage: $perPage) {
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

export const getPosts = cache(async (page = 1, perPage = 15) => {
  const { data } = await apolloClient.query({
    query: GET_POSTS_QUERY,
    variables: { page, perPage },
  });
  return { json: () => Promise.resolve(data.posts) };
});
