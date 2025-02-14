"use client"

import { ApolloLink, HttpLink } from "@apollo/client"
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
	SSRMultipartLink
} from "@apollo/experimental-nextjs-app-support"

function makeClient() {
	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
    fetchOptions: { cache: "no-store" }
	})

	return new ApolloClient({
		cache: new InMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true
						}),
						httpLink
				  ])
				: httpLink,
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
