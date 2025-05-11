import { apolloClient, GetPostDocument } from "@/app/graphql";
import { cache } from "react";

export const getPost = cache(async (id: string) => {
  const { data } = await apolloClient.query({
    query: GetPostDocument,
    variables: { id },
  });
  return { json: () => Promise.resolve(data.post) };
});
