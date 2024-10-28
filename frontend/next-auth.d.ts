import "next-auth"

declare module "next-auth" {
	interface User {
		id: string
		username: string
		email: string
		avatar: string
		description: string
		token: string
	}
	interface Session {
		user: User
		token: string
	}
}
