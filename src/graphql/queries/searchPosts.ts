import { gql } from '@apollo/client';
import { POSTS_FRAGMENT } from '@/components/ui/Posts/index';

export const SEARCH_POSTS = gql`
  query SearchPosts($title: String!, $page: Int, $perPage: Int) {
    ${POSTS_FRAGMENT}
    published {
      searchPosts(title: $title, page: $page, perPage: $perPage) {
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
