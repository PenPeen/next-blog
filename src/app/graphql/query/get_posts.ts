import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($page: Int, $perPage: Int) {
    posts(page: $page, perPage: $perPage) {
      posts {
        id
        userId
        title
        content
        thumbnailUrl
        published
        createdAt
        updatedAt
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
