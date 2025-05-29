import { gql } from '@apollo/client';
import { COMMENT_FRAGMENT } from '@/components/ui/Comment';

export const CREATE_COMMENT_DOCUMENT = gql`
  mutation CreateComment($input: CreateCommentMutationInput!) {
    createComment(input: $input) {
      comment {
        ...CommentItem
      }
      errors {
        message
        path
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;
