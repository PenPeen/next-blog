import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

const endpoint = new HttpLink({
  uri: `http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/graphql`,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  }
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: endpoint,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });
});
