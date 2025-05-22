import { GetPostsDocument, GetPostsQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const getPublishedPosts = cache(async (page = 1, perPage = 15) => {
  const { data } = await query({
    query: GetPostsDocument,
    variables: { page, perPage },
    context: {
      fetchOptions: {
        cache: "force-cache",
        next: {revalidate: 60},
      },
    },
  });
  return { json: () => Promise.resolve<GetPostsQuery['published']['posts']>(data.published.posts) };
});
