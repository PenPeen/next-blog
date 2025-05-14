import { apolloClient, GetPostDocument, GetPostQuery } from "@/app/graphql";
import { cache } from "react";

export const getPost = cache(async (id: string) => {
  const { data } = await apolloClient.query({
    query: GetPostDocument,
    variables: { id },
  });
  return { json: () => Promise.resolve<GetPostQuery['published']['post']>(data.published.post) };
});
