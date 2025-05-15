import { gql } from '@apollo/client';
import '@/components/ui/Posts/index';

export const SEARCH_POSTS = gql`
  query SearchPosts($title: String!, $page: Int, $perPage: Int) {
    published {
      searchPosts(title: $title, page: $page, perPage: $perPage) {
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
