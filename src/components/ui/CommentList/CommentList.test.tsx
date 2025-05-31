import { render, screen, act, waitFor } from "@testing-library/react";
import CommentList from ".";
import { CommentItemFragment } from "@/app/graphql/generated";
import React from 'react';

const mockFetchMore = jest.fn();
jest.mock('@apollo/client', () => ({
  useQuery: () => ({
    fetchMore: mockFetchMore
  })
}));

jest.mock('@/components/ui/Comment', () => ({
  __esModule: true,
  default: ({ comment }: { comment: CommentItemFragment }) =>
    <div data-testid={`comment-${comment.id}`}>{comment.content}</div>
}));

class MockIntersectionObserver implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;
  root: Element | Document | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.elements = new Set();
    if (options) {
      this.root = options.root || null;
      this.rootMargin = options.rootMargin || '0px';
      this.thresholds = options.threshold ?
        (Array.isArray(options.threshold) ? options.threshold : [options.threshold]) :
        [0];
    }
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  triggerIntersection(isIntersecting: boolean) {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(element => ({
      isIntersecting,
      target: element,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
      rootBounds: null,
      time: Date.now()
    }));

    this.callback(entries, this);
  }
}

const createMockComment = (id: string): CommentItemFragment => ({
  __typename: 'Comment',
  id,
  content: `Test comment ${id}`,
  createdAt: new Date().toISOString(),
  user: {
    __typename: 'User',
    name: `User ${id}`,
    userImage: {
      __typename: 'UserImage',
      profile: null
    }
  }
});

const createMockFetchMoreResponse = (newComments: CommentItemFragment[], hasNextPage: boolean, endCursor: string) => ({
  data: {
    postCommentsCursor: {
      edges: newComments.map(comment => ({
        node: comment,
        cursor: comment.id
      })),
      pageInfo: {
        hasNextPage,
        endCursor
      }
    }
  }
});

describe("CommentList", () => {
  let originalIntersectionObserver: typeof IntersectionObserver;
  let mockObserver: MockIntersectionObserver;

  beforeAll(() => {
    originalIntersectionObserver = window.IntersectionObserver;

    window.IntersectionObserver = function(callback, options) {
      mockObserver = new MockIntersectionObserver(callback, options);
      return mockObserver;
    };
  });

  afterAll(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  beforeEach(() => {
    mockFetchMore.mockReset();
  });

  describe('レンダリングテスト', () => {
    it("コメントが表示される", () => {
      render(<CommentList comments={[createMockComment("1"), createMockComment("2")]} postId="post1" endCursor="abc" />);
      expect(screen.getByText("コメント")).toBeInTheDocument();
      expect(screen.getByTestId("comment-1")).toBeInTheDocument();
      expect(screen.getByTestId("comment-2")).toBeInTheDocument();
    });

    it("コメントが0件の時", () => {
      render(<CommentList comments={[]} postId="post1" endCursor="" />);
      expect(screen.getByText("コメント")).toBeInTheDocument();
      expect(screen.getByText("まだコメントはありません")).toBeInTheDocument();
    });
  });

  describe('動作テスト', () => {
    it("ロード中表示が正しく表示される", async () => {

      mockFetchMore.mockImplementation(() => new Promise(() => {}));


      render(<CommentList comments={[createMockComment("1")]} postId="post1" endCursor="abc" />);


      act(() => {
        mockObserver.triggerIntersection(true);
      });


      await waitFor(() => {
        expect(screen.getByText("コメントを読み込み中...")).toBeInTheDocument();
      });
    });

    it("新しいコメントを読み込んで表示する", async () => {
      const newComments = [createMockComment("3"), createMockComment("4")];

      mockFetchMore.mockResolvedValue(
        createMockFetchMoreResponse(newComments, true, "xyz")
      );

      render(<CommentList comments={[createMockComment("1"), createMockComment("2")]} postId="post1" endCursor="abc" />);

      act(() => {
        mockObserver.triggerIntersection(true);
      });

      await waitFor(() => {
        expect(screen.getByTestId("comment-3")).toBeInTheDocument();
        expect(screen.getByTestId("comment-4")).toBeInTheDocument();
      });

      expect(mockFetchMore).toHaveBeenCalledWith({
        variables: {
          postId: "post1",
          first: 20,
          after: "abc",
        },
      });
    });

    it("エラー発生時の処理が正しく行われる", async () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      mockFetchMore.mockRejectedValue(new Error("Error fetching comments"));

      render(<CommentList comments={[createMockComment("1")]} postId="post1" endCursor="abc" />);

      act(() => {
        mockObserver.triggerIntersection(true);
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'コメントの取得に失敗しました',
          expect.any(Error)
        );
      });

      console.error = originalConsoleError;
    });

    it("hasNextPageがfalseの場合、追加読み込みが行われない", async () => {
      mockFetchMore.mockClear();
      mockFetchMore.mockImplementationOnce(() => {
        setTimeout(() => {

          act(() => {
            mockObserver.triggerIntersection(true);
          });
        }, 0);

        return Promise.resolve(
          createMockFetchMoreResponse([], false, "")
        );
      });

      render(<CommentList comments={[createMockComment("1")]} postId="post1" endCursor="test-cursor" />);

      act(() => {
        mockObserver.triggerIntersection(true);
      });

      await waitFor(() => {
        expect(mockFetchMore).toHaveBeenCalledTimes(1);
      });

      mockFetchMore.mockClear();
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockFetchMore).not.toHaveBeenCalled();
    });
  });
});
