import { apolloClient, SearchPostsDocument, SearchPostsQuery } from "@/app/graphql";
import { cache } from "react";

export const searchPosts = cache(
  async (title: string, page = 1, perPage = 15) => {
    const { data } = await apolloClient.query({
      query: SearchPostsDocument,
      variables: { title, page, perPage },
    });
    return { json: () => Promise.resolve<SearchPostsQuery['published']['searchPosts']>(data.published.searchPosts) };
  }
);
