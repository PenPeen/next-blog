import { MY_POST_FRAGMENT } from '@/components/ui/MyPostItem';
import { gql } from '@apollo/client';

export const GET_MY_POSTS = gql`
  query GetMyPosts($page: Int, $perPage: Int) {
    ${MY_POST_FRAGMENT}
    myPosts(page: $page, perPage: $perPage) {
      posts {
        ...myPostFragment
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
