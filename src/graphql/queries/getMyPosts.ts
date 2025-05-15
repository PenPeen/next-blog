import { gql } from '@apollo/client';
import '@/components/ui/Posts/index';

export const GET_MY_POSTS = gql`
  query GetMyPosts($page: Int, $perPage: Int) {
    myPosts(page: $page, perPage: $perPage) {
      posts {
        ...postsTopFragment
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
