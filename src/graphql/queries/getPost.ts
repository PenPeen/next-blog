import { gql } from '@apollo/client';
import '@/components/ui/PostContent/index';

export const GET_POST = gql`
  query GetPost($id: ID!) {
    published {
      post(id: $id) {
        ...postFragment
      }
    }
  }
`;
