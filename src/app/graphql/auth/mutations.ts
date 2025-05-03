import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($userInput: UserInputType!) {
    createUser(userInput: $userInput) {
      user {
        id
        name
        email
      }
      token
      message
    }
  }
`;
