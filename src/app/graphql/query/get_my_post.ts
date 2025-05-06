import { gql } from '@apollo/client';

export const GET_MY_POSTS = gql`
  query GetMyPosts($page: Int, $perPage: Int) {
    myPosts(page: $page, perPage: $perPage) {
      posts{
        id
        title
        published
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
