import { User } from "@prisma/client"

export type Token = {
	id: string
	email: string
	username: string
}

export interface Context {
	id: string
	auth: boolean
}

export type PostFilterInput = {
	user?: string
	title?: string
	technology?: string
	rating?: number
}

export type NewTechnology = {
	name: string
}

export type Notification = {
  idUser: string
  username: string
  message: string
  text: string
}

export type Follower = {
	follower: User
	following: User
	idFollower: string
	idFollowing: string
	createdAt: string
}