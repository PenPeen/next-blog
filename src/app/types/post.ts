export type Post = {
  id: number;
  userId: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostsResponse = {
  edges: {
    cursor: string;
    node: Post;
  }[];
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
    startCursor: string;
    hasPreviousPage: boolean;
  };
  totalCount: number;
  currentPage: number;
  totalPage: number;
};
