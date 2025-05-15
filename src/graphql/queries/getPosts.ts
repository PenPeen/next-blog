import { gql } from '@apollo/client';
import '@/components/ui/Posts/index';

export const GET_POSTS = gql`
  query GetPosts($page: Int, $perPage: Int) {
    published {
      posts(page: $page, perPage: $perPage) {
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
  }
`;
