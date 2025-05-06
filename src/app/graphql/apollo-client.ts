import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const endpoint = new HttpLink({
  uri: `http://${process.env.NEXT_PUBLIC_RAILS_API_DOMAIN}/graphql`,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  }
});

export const apolloClient = new ApolloClient({
  link: endpoint,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
  connectToDevTools: process.env.NODE_ENV !== 'production',
});
