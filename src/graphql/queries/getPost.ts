import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '@/components/ui/PostContent/index';
import { COMMENT_FRAGMENT } from '@/components/ui/Comment';

export const GET_POST = gql`
  query GetPost($id: ID!, $first: Int!) {
    published {
      post(id: $id) {
        ...Post
      }
    }
    postCommentsCursor(postId: $id, first: $first) {
      edges {
        cursor
        node {
          ...CommentItem
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
  ${POST_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;
