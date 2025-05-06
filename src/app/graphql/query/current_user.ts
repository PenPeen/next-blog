import { gql } from '@apollo/client';

export const GET_MY_POSTS = gql`
  query CurrentUser {
    currentUser {
      id
      email
      name
    }
  }
`;
