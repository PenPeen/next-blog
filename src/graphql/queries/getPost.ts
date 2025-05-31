// TOOD: 20件を定数管理できるか

import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '@/components/ui/PostContent/index';
import { COMMENT_FRAGMENT } from '@/components/ui/Comment';

export const GET_POST = gql`
  query GetPost($id: ID!) {
    ${POST_FRAGMENT}
    published {
      post(id: $id) {
        ...Post
      }
    }
    ${COMMENT_FRAGMENT}
    postCommentsCursor(postId: $id, first: 20) {
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
`;
