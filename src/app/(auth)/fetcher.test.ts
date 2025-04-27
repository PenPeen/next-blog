import { NextRequest } from "next/server";
import { apolloClient } from "@/app/graphql/apollo-client";
import { CURRENT_USER_QUERY } from "@/app/graphql/auth/queries";
import { getCurrentUser } from "./fetcher";

jest.mock('@/app/graphql/apollo-client', () => ({
  apolloClient: {
    query: jest.fn()
  }
}));

describe('getCurrentUser', () => {
  test('ユーザーデータを正しく取得できる', async () => {
    const mockRequest = {
      headers: {
        get: jest.fn().mockReturnValue('cookie-value')
      }
    } as unknown as NextRequest;

    const mockUser = { id: 1, name: '山田太郎' };

    (apolloClient.query as jest.Mock).mockResolvedValue({
      data: { currentUser: mockUser }
    });

    const result = await getCurrentUser(mockRequest);

    expect(result).toEqual(mockUser);
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: CURRENT_USER_QUERY,
      context: {
        headers: {
          Cookie: 'cookie-value'
        }
      }
    });
  });
});
