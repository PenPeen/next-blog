import { query } from "../app/apollo-client";
import { cache } from "react";
import { cookies } from "next/headers";
import { MyPostDocument, MyPostQuery } from "@/app/graphql";

export const getMyPost = cache(async (id: string) => {
  const cookiesObj = await cookies();
  const cookieHeader = cookiesObj.toString();

  const { data } = await query({
    query: MyPostDocument,
    variables: { id },
    context: {
      headers: {
        Cookie: cookieHeader,
      },
    },
  });
  return { json: () => Promise.resolve<MyPostQuery['myPost']>(data.myPost) };
});
