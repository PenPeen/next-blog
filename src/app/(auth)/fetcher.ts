import { NextRequest } from "next/server";
import { apolloClient } from "../graphql";
import { CURRENT_USER_QUERY } from "../graphql/auth/queries";
import { User } from "@/app/types";
import { cookies } from "next/headers";

export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
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
    query: CURRENT_USER_QUERY,
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
    fetchPolicy: 'no-cache',
  });
  return data.currentUser as User;
}
