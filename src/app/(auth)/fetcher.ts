import { NextRequest } from "next/server";
import { apolloClient, CurrentUserDocument, CurrentUserQuery } from "@/app/graphql";
import { cookies } from "next/headers";

export async function getCurrentUser(request?: NextRequest): Promise<CurrentUserQuery['currentUser']> {
  let cookieHeader: string | null = null;

  // NOTE: call from middleware
  if (request) {
    cookieHeader = request.headers.get('cookie');
  }
  // NOTE: call from Server Component
  else {
      const cookiesObj = await cookies();
      cookieHeader = cookiesObj.toString();
  }

  if (!cookieHeader) {
    return null;
  }

  const { data } = await apolloClient.query({
    query: CurrentUserDocument,
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
    fetchPolicy: 'no-cache',
  });

  return data.currentUser
}
