import { SearchPostsDocument, SearchPostsQuery } from "@/app/graphql/generated";
import { query } from "@/app/apollo-client";
import { cache } from "react";

export const searchPosts = cache(
  async (title: string, page = 1, perPage = 15) => {
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
    return { json: () => Promise.resolve<SearchPostsQuery['published']['searchPosts']>(data.published.searchPosts) };
  }
);
