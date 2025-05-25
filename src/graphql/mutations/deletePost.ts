import { gql } from '@apollo/client';

export const DELETE_POST = gql`
  mutation DeletePost($input: DeletePostMutationInput!) {
    deletePost(input: $input) {
      success
      message
      errors {
        message
        path
      }
    }
  }
`;
