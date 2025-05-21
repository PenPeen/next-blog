"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";

export function makeClient() {
  const httpLink = new HttpLink({
    uri: `http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/graphql`,
    credentials: 'include',
    fetchOptions: {
      mode: 'cors',
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
