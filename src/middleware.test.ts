import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/(auth)/fetcher";
import { middleware } from "./middleware";

jest.mock('@/app/(auth)/fetcher', () => ({
  getCurrentUser: jest.fn()
}));

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('保護されたルートに非認証ユーザーがアクセスすると、リダイレクトされる', async () => {
    const mockRequest = {
      url: 'http://localhost:3000/account',
      nextUrl: new URL('http://localhost:3000/account')
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const response = await middleware(mockRequest as unknown as NextRequest);

    expect(response.status).toEqual(307); // リダイレクトステータスコード
    expect(response.headers.get('location')).toEqual('http://localhost:3000/');
  });

  test('保護されたルートに認証済みユーザーがアクセスすると、アクセスが許可される', async () => {
    const mockRequest = {
      url: 'http://localhost:3000/account',
      nextUrl: new URL('http://localhost:3000/account')
    };

    (getCurrentUser as jest.Mock).mockResolvedValue({ id: 1 });

    const response = await middleware(mockRequest as unknown as NextRequest);

    expect(response).toEqual(NextResponse.next());
  });
});
