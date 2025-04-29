import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($page: Int, $perPage: Int) {
    posts(page: $page, perPage: $perPage) {
      posts {
        id
        userId
        title
        content
        thumbnailUrl
        published
        createdAt
        updatedAt
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

export const GET_MY_POSTS = gql`
  query GetMyPosts($page: Int, $perPage: Int) {
    myPosts(page: $page, perPage: $perPage) {
      posts{
        id
        title
        published
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

export const SEARCH_POSTS = gql`
  query SearchPosts($title: String!, $page: Int, $perPage: Int) {
    searchPosts(title: $title, page: $page, perPage: $perPage) {
      posts {
        id
        userId
        title
        content
        thumbnailUrl
        published
        createdAt
        updatedAt
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

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      title
      content
      thumbnailUrl
      createdAt
    }
  }
`;
