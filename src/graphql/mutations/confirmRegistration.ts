import { gql } from '@apollo/client';

export const CONFIRM_REGISTRATION_MUTATION = gql`
  mutation ConfirmRegistration($token: String!) {
    confirmRegistration(input: { token: $token }) {
      success
      token
      errors {
        message
        path
      }
    }
  }
`;
