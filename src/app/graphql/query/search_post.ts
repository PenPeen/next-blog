import { gql } from '@apollo/client';

export const SEARCH_POSTS = gql`
  query SearchPosts($title: String!, $page: Int, $perPage: Int) {
    searchPosts(title: $title, page: $page, perPage: $perPage) {
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
