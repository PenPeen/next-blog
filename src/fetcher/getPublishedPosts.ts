import { apolloClient, GetPostsDocument, GetPostsQuery } from "@/app/graphql";
import { cache } from "react";

export const getPosts = cache(async (page = 1, perPage = 15) => {
  const { data } = await apolloClient.query({
    query: GetPostsDocument,
    variables: { page, perPage },
  });
  return { json: () => Promise.resolve<GetPostsQuery['published']['posts']>(data.published.posts) };
});
