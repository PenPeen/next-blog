import { gql } from '@apollo/client';

export const GET_CURSOR_COMMENTS = gql`
query PostCommentsCursor($postId: ID!, $first: Int, $after: String) {
  postCommentsCursor(postId: $postId, first: $first, after: $after) {
    edges {
      cursor
      node {
        id
        content
        user {
          id
          name
        }
        createdAt
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;
