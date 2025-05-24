import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostMutationInput!) {
    createPost(input: $input) {
      post {
        id
        title
        content
        published
        thumbnailUrl
      }
      errors {
        message
        path
      }
    }
  }
`;
