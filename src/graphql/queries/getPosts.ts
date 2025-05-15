import { gql } from '@apollo/client';
import { POSTS_FRAGMENT } from '@/components/ui/Posts/index';

export const GET_POSTS = gql`
  query GetPosts($page: Int, $perPage: Int) {
    ${POSTS_FRAGMENT}
    published {
      posts(page: $page, perPage: $perPage) {
        posts {
          ...postsFragment
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
