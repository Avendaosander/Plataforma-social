"use client"

import { ApolloLink, HttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
	SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support"

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

	return new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
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
