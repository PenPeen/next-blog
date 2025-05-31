import { getPost } from '@/fetcher';

jest.mock('@/fetcher', () => ({
  getPost: jest.fn()
}));

const mockCommentsData = {
  postCommentsCursor: {
    edges: [
      {
        node: {
          __typename: 'Comment' as const,
          id: 'comment1',
          content: 'テストコメント1',
          createdAt: '2023-01-01T00:00:00Z',
          user: {
            __typename: 'User' as const,
            name: 'テストユーザー1',
            userImage: {
              __typename: 'UserImage' as const,
              profile: null
            }
          }
        }
      },
      {
        node: {
          __typename: 'Comment' as const,
          id: 'comment2',
          content: 'テストコメント2',
          createdAt: '2023-01-02T00:00:00Z',
          user: {
            __typename: 'User' as const,
            name: 'テストユーザー2',
            userImage: {
              __typename: 'UserImage' as const,
              profile: null
            }
          }
        }
      }
    ],
    pageInfo: {
      endCursor: 'endCursor123',
      hasNextPage: true
    }
  }
};

const emptyCommentsData = {
  postCommentsCursor: {
    edges: [],
    pageInfo: {
      endCursor: '',
      hasNextPage: false
    }
  }
};

describe('CommentListContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getPostからデータを取得してCommentListに正しくデータを渡す', async () => {
    (getPost as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockCommentsData)
    });

    const result = await getPost('1234');
    const json = await result.json();

    expect(getPost).toHaveBeenCalledWith('1234');
    expect(json).toEqual(mockCommentsData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comments = json.postCommentsCursor.edges.map((edge: any) => edge.node);
    expect(comments).toHaveLength(2);
    expect(comments[0].id).toBe('comment1');
    expect(comments[1].id).toBe('comment2');
    expect(json.postCommentsCursor.pageInfo.endCursor).toBe('endCursor123');
  });

  it('コメントがない場合も正しく処理する', async () => {
    (getPost as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(emptyCommentsData)
    });

    const result = await getPost('1234');
    const json = await result.json();

    expect(getPost).toHaveBeenCalledWith('1234');
    expect(json).toEqual(emptyCommentsData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const comments = json.postCommentsCursor.edges.map((edge: any) => edge.node);
    expect(comments).toHaveLength(0);
    expect(json.postCommentsCursor.pageInfo.endCursor).toBe('');
  });
});
