import { gql } from '@apollo/client';
import { POST_FORM_FRAGMENT } from '@/components/ui/PostForm';

export const GET_MY_POST_FROM = gql`
  query myPost($id: ID!) {
    ${POST_FORM_FRAGMENT}
    myPost(id: $id) {
      ...POST_FORM_FRAGMENT
    }
  }
`;
