import { deleteUser, getUser, getUsers, login, postUser, putUser } from "./users.js"

export const resolvers = {
	Query: {
		getUsers,
		getUser,
		login,
	},
	Mutation: {
		postUser,
		putUser,
		deleteUser
	}
}
