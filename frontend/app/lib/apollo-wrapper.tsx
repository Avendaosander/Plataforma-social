"use client"

import { ApolloLink, HttpLink, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
	SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support"
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";

function makeClient() {
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
    fetchOptions: { cache: "no-store" }
	})

	const wsLink = new GraphQLWsLink(
		createClient({
			url: 'ws://localhost:4000/graphql',
		})
	)

	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' && 
				definition.operation === 'subscription'
			)
		},
		wsLink,
		authLink.concat(httpLink),
	);

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: splitLink,
		name: "Plataforma Social",
		version: "1.0"
	})
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	)
}
