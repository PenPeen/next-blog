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

jest.mock('@/app/apollo-client', () => ({
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

  it('確認処理でのAPIエラー応答を適切に処理し、トップページにリダイレクトされる', async () => {
    // エラーメッセージを含む応答をシミュレート
    (getClient().mutate as jest.Mock).mockResolvedValue({
      data: {
        confirmRegistration: {
          errors: [
            { message: 'トークンの有効期限が切れています' },
            { message: '別のエラー' }
          ]
        }
      }
    });

    const mockRequest = new NextRequest('https://example.com/api/registration/confirm?token=expired-token') as jest.Mocked<NextRequest>;
    (mockRequest.nextUrl.searchParams.get as jest.Mock).mockImplementation((param: string) => {
      if (param === 'token') return 'expired-token';
      return null;
    });

    // エラーログをモック
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // 関数を実行
    const response = await GET(mockRequest);

    // アサーション
    expect(getClient().mutate).toHaveBeenCalledWith({
      mutation: expect.anything(),
      variables: { token: 'expired-token' }
    });

    // エラーがログに記録されていることを確認
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ message: 'トークンの有効期限が切れています' }),
      expect.objectContaining({ message: '別のエラー' })
    ]));

    // エラーフラッシュが設定されていることを確認
    expect(setFlash).toHaveBeenCalledWith({
      type: 'error',
      message: 'トークンの有効期限が切れています\n別のエラー'
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(307); // 一時的なリダイレクト
    expect(response.headers.get('location')).toBe('https://example.com/');
  });

  it('トークンが空の場合も適切に処理される', async () => {
    const mockRequest = new NextRequest('https://example.com/api/registration/confirm') as jest.Mocked<NextRequest>;
    (mockRequest.nextUrl.searchParams.get as jest.Mock).mockImplementation((param: string) => {
      if (param === 'token') return '';
      return null;
    });

    // 関数を実行
    await GET(mockRequest);

    // アサーション
    expect(getClient().mutate).toHaveBeenCalledWith({
      mutation: expect.anything(),
      variables: { token: '' }
    });
  });
});
