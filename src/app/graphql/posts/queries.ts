import { gql } from '@apollo/client';

export const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts($page: Int, $perPage: Int) {
    publishedPosts(page: $page, perPage: $perPage) {
      id
      userId
      title
      content
      thumbnailUrl
      published
      createdAt
      updatedAt
    }
  }
`;
