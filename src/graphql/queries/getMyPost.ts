import { gql } from '@apollo/client';

// TODO: Use Fragment
export const GET_MY_POST = gql`
  query myPost($id: ID!) {
    myPost(id: $id) {
      id
      title
      content
      published
    }
  }
`;
