import type { Metadata } from "next"
import { Barlow } from "next/font/google"
import "./globals.css"
import clsx from "clsx"
import { ApolloWrapper } from "./lib/apollo-wrapper"
import { SessionWrapper } from "./lib/session-wrapper"

const inter = Barlow({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: "UVM Dev House",
	description:
		"Plataforma social de componentes Open Source de la Universidad Valle del Momboy"
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className="scroll-smooth">
			<body
				className={clsx(
					inter.className,
					"bg-storm-50 text-seagreen-950 dark:bg-storm-950 dark:text-white"
				)}
			>
				<SessionWrapper>
					<ApolloWrapper>
							{children}
					</ApolloWrapper>
				</SessionWrapper>
			</body>
		</html>
	)
}
