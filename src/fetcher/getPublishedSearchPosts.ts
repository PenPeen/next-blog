import { SearchPostsDocument, SearchPostsQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const getPublishedSearchPosts = cache(
  async (title: string, page = 1, perPage = 15): Promise<SearchPostsQuery['published']['searchPosts']> => {
    const { data } = await query({
      query: SearchPostsDocument,
      variables: { title, page, perPage },
      context: {
        fetchOptions: {
          cache: "force-cache",
          next: {revalidate: 60},
        },
      },
    });
    return data.published.searchPosts;
  }
);
