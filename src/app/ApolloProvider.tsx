"use client";

import { ApolloProvider as Provider } from "@apollo/client";
import { apolloClient } from "./graphql/apollo-client";

export default function ApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider client={apolloClient}>{children}</Provider>;
}
