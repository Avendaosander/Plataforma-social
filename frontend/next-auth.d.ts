import "next-auth"
import { Setting } from "./app/lib/types/typesGraphql"

declare module "next-auth" {
	interface User {
		id: string
		username: string
		email: string
		avatar: string
		description: string
		Setting: Setting
		token: string
	}
	interface Session {
		user: User
		token: string
	}
}
