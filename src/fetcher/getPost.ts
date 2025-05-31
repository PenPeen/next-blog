import { GetPostDocument, GetPostQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const getPost = cache(async (id: string) => {
  const { data } = await query({
    query: GetPostDocument,
    variables: { id },
    context: {
      fetchOptions: {
        cache: "force-cache",
        next: {revalidate: 60},
      },
    },
  });
  return { json: () => Promise.resolve<GetPostQuery>(data) };
});
