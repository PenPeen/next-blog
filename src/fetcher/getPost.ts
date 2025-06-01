import { GetPostWithCommentsDocument, GetPostWithCommentsQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const getPost = cache(async (id: string): Promise<GetPostWithCommentsQuery> => {
  const { data } = await query({
    query: GetPostWithCommentsDocument,
    variables: { id, first: 20 },
    context: {
      fetchOptions: {
        cache: "force-cache",
        next: {revalidate: 60},
      },
    },
  });
  return data;
});
