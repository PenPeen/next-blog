import { MY_POST_FORM_FRAGMENT } from '@/components/ui/MyPostForm';
import { gql } from '@apollo/client';

export const GET_MY_POSTS = gql`
  query GetMyPosts($page: Int, $perPage: Int) {
    ${MY_POST_FORM_FRAGMENT}
    myPosts(page: $page, perPage: $perPage) {
      posts {
        ...MyPostItem
      }
      pagination {
        totalCount
        limitValue
        totalPages
        currentPage
      }
    }
  }
`;
