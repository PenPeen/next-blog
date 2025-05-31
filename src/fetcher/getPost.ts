import { GetPostWithCommentsDocument, GetPostQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const getPost = cache(async (id: string) => {
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
  return { json: () => Promise.resolve<GetPostQuery>(data) };
});
