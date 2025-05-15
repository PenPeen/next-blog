import { gql } from '@apollo/client';
import { POST_FRAGMENT } from '@/components/ui/PostContent/index';

export const GET_POST = gql`
  query GetPost($id: ID!) {
    ${POST_FRAGMENT}
    published {
      post(id: $id) {
        ...postFragment
      }
    }
  }
`;
