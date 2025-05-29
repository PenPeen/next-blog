import { NextRequest } from "next/server";
import { GetCurrentUserDocument, GetCurrentUserQuery } from "@/app/graphql";
import { cookies } from "next/headers";
import { cache } from "react";
import { query } from "@/app/apollo-client";

export type CurrentUserType = GetCurrentUserQuery['currentUser'];

export const getCurrentUser = cache(async (request?: NextRequest): Promise<GetCurrentUserQuery['currentUser']> => {
  const cookieHeader = await getCookieHeader(request);

  if (!cookieHeader) {
    return null;
  }

  return getUserFromCookie(cookieHeader)
});

// NOTE: Middleware と ServerComponents で CookieHeader を取得する方法が異なる。
async function getCookieHeader(request?: NextRequest) {
  // middleware
  if (request) {
    return request.headers.get('cookie');
  }
  // Server Component
  else {
    const cookiesObj = await cookies();
    return cookiesObj.toString();
  }
}

const getUserFromCookie = async (cookieHeader: string) => {
  const { data } = await query({
    query: GetCurrentUserDocument,
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
    fetchPolicy: 'no-cache',
  });

  return data.currentUser
};
