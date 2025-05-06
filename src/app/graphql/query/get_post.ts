import { gql } from '@apollo/client';

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
