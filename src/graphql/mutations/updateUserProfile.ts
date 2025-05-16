import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileMutationInput!) {
    updateUserProfile(input: $input) {
      message
      user {
        id
        name
        userImage {
          profile
        }
      }
    }
  }
`;
