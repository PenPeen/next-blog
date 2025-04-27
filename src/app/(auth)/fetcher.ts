import 'server-only'

import { NextRequest } from "next/server";
import { apolloClient } from "../graphql";
import { CURRENT_USER_QUERY } from "../graphql/auth/queries";
import { User } from "@/app/types";

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const cookieHeader = request.headers.get('cookie');

  const { data } = await apolloClient.query({
    query: CURRENT_USER_QUERY,
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });
  return data.currentUser as User;
}
