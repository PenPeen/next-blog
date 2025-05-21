import { NextRequest } from 'next/server';
import { GET } from './route';
import { getClient } from '../../../apollo-client';
import { cookies } from 'next/headers';
import { setFlash } from '@/actions/flash';

jest.mock('next/server', () => {
  const nextUrlMock = {
    searchParams: {
      get: jest.fn()
    }
  };

  return {
    NextRequest: jest.fn().mockImplementation((url) => {
      return {
        nextUrl: nextUrlMock,
        url
      };
    }),
    NextResponse: {
      redirect: jest.fn().mockImplementation((url) => {
        const redirectUrl = typeof url === 'string' ? url : url.toString();
        return {
          status: 307,
          headers: new Map([['location', redirectUrl]]),
          url: redirectUrl
        };
      }),
    }
  };
});

// モックの設定
jest.mock('@/app/graphql/apollo-client', () => ({
  getClient: jest.fn().mockReturnValue({
    mutate: jest.fn()
  })
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    set: jest.fn(),
    get: jest.fn()
  })
}));

jest.mock('@/actions/flash', () => ({
  setFlash: jest.fn()
}));

describe('Registration Confirmation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常に会員登録確認が完了し、アカウントページにリダイレクトされる', async () => {
    (getClient().mutate as jest.Mock).mockResolvedValue({
      data: {
        confirmRegistration: {
          success: true,
          token: 'test-token'
        }
      }
    });

    const cookieStoreMock = {
      set: jest.fn()
    };
    (cookies as jest.Mock).mockReturnValue(cookieStoreMock);

    // mockRequestの設定を更新
    const mockRequest = new NextRequest('https://example.com/api/registration/confirm?token=valid-token') as jest.Mocked<NextRequest>;
    (mockRequest.nextUrl.searchParams.get as jest.Mock).mockImplementation((param: string) => {
      if (param === 'token') return 'valid-token';
      return null;
    });

    // Routeモジュールのmockをセットアップ
    jest.spyOn(global.URL.prototype, 'toString').mockImplementation(function(this: URL) {
      if (this.href.includes('/account')) {
        return 'https://example.com/account';
      }
      return 'https://example.com/';
    });

    // 関数を実行
    const response = await GET(mockRequest);

    // アサーション
    expect(getClient().mutate).toHaveBeenCalledWith({
      mutation: expect.anything(),
      variables: { token: 'valid-token' }
    });

    expect(cookieStoreMock.set).toHaveBeenCalledWith(
      'ss_sid',
      'test-token',
      expect.objectContaining({
        httpOnly: true,
        secure: true
      })
    );

    expect(setFlash).toHaveBeenCalledWith({
      type: 'success',
      message: '会員登録が完了しました。'
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(307); // 一時的なリダイレクト
    expect(response.headers.get('location')).toBe('https://example.com/account');
  });

  it('トークンが無効な場合、エラーフラッシュが設定され、トップページにリダイレクトされる', async () => {
    // モックがエラーをスローするように設定
    (getClient().mutate as jest.Mock).mockRejectedValue({
      message: 'トークンが無効です'
    });

    // mockRequestの設定を更新
    const mockRequest = new NextRequest('https://example.com/api/registration/confirm?token=invalid-token') as jest.Mocked<NextRequest>;
    (mockRequest.nextUrl.searchParams.get as jest.Mock).mockImplementation((param: string) => {
      if (param === 'token') return 'invalid-token';
      return null;
    });

    // 関数を実行
    const response = await GET(mockRequest);

    // アサーション
    expect(getClient().mutate).toHaveBeenCalledWith({
      mutation: expect.anything(),
      variables: { token: 'invalid-token' }
    });

    expect(setFlash).toHaveBeenCalledWith({
      type: 'error',
      message: 'トークンが無効です'
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(307); // 一時的なリダイレクト
    expect(response.headers.get('location')).toBe('https://example.com/');
  });
});
