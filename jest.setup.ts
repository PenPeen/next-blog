import '@testing-library/jest-dom';

interface CustomRequest {
  url: string;
  method: string;
  headers: any;
}

interface CustomHeaders {
  headers: Record<string, string>;
  get(name: string): string | null;
}

interface CustomResponse {
  body: any;
  status: number;
  ok: boolean;
  headers: any;
}

// @ts-ignore
global.Request = class implements CustomRequest {
  url: string;
  method: string;
  headers: any;

  constructor(url: string | URL, options: Record<string, any> = {}) {
    this.url = url.toString();
    this.method = options.method || 'GET';
    this.headers = new (global.Headers as any)(options.headers || {});
  }
};

// @ts-ignore
global.Headers = class implements CustomHeaders {
  headers: Record<string, string>;

  constructor(init: Record<string, string> = {}) {
    this.headers = { ...init };
  }

  get(name: string): string | null {
    return this.headers[name] || null;
  }
};

// @ts-ignore
global.Response = class implements CustomResponse {
  body: any;
  status: number;
  ok: boolean;
  headers: any;

  constructor(body: any, options: Record<string, any> = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new (global.Headers as any)(options.headers || {});
  }
};

// NextResponseのモック
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn().mockImplementation((url: URL) => ({
      status: 307,
      headers: new (global.Headers as any)({ location: url.toString() })
    })),
    next: jest.fn().mockImplementation(() => ({
      status: 200,
      headers: new (global.Headers as any)()
    }))
  }
}));

jest.mock('server-only', () => ({}));
