import { gql } from '@apollo/client';

export const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts($first: Int, $after: String, $last: Int, $before: String) {
    posts(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          id
          userId
          title
          content
          thumbnailUrl
          published
          createdAt
          updatedAt
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      totalCount
      currentPage
      totalPage
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
