import { gql } from '@apollo/client';
import { MY_POST_FORM_FRAGMENT } from '@/components/ui/MyPostForm';

export const GET_MY_POST_FROM = gql`
  query myPost($id: ID!) {
    ${MY_POST_FORM_FRAGMENT}
    myPost(id: $id) {
      ...MY_POST_FORM_FRAGMENT
    }
  }
`;
