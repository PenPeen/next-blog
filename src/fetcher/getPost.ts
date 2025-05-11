import { apolloClient } from "@/app/graphql";
import { POST_FRAGMENT } from "@/components/ui/PostContent";
import { gql } from "@apollo/client";
import { cache } from "react";

export const GET_POST_QUERY = gql`
  ${POST_FRAGMENT}
  query FetchPostWithFragment($id: ID!) {
    post(id: $id) {
      ...postFragment
    }
  }
`;

export const getPost = cache(async (id: string) => {
  const { data } = await apolloClient.query({
    query: GET_POST_QUERY,
    variables: { id },
  });
  return { json: () => Promise.resolve(data.post) };
});
