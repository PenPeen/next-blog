import { gql } from '@apollo/client';

export const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts($page: Int, $perPage: Int) {
    publishedPosts(page: $page, perPage: $perPage) {
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

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      title
      content
      thumbnailUrl
      createdAt
    }
  }
`;
