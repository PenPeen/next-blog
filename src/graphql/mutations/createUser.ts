import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($userInput: UserInputType!) {
    createUser(userInput: $userInput) {
      user {
        id
        name
        email
      }
      token
      message
      errors {
        message
        path
      }
    }
  }
`;
