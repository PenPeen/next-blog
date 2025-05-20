import { gql } from '@apollo/client';

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostMutationInput!) {
    updatePost(input: $input) {
      post {
        id
        title
        content
        published
      }
      errors {
        message
        path
      }
    }
  }
`;
