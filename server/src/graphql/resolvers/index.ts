import { deleteUser, getUser, getUsers, login, postUser, putUser } from "./users.js"
import { deleteFollower, getFollowers, postFollower } from "./followers.js"
import { deletePost, getPost, getPosts, getPostsFilter, getPostsFollowings, getPostsUser, postPost, putPost } from "./posts.js"
import { getTechnologies } from "./technologhy.js"
import { deleteComment, getComments, postComment } from "./comments.js"
import { deleteRating, postRating, putRating } from "./ratings.js"
import { deletePostSaved, getPostsSaved, postPostSaved } from "./post_saved.js"
import { newFollower, postCommented, postCreated, postDeleted, postEdited, postRated, postSaved } from "./subscriptions.js"
import { PubSub } from "graphql-subscriptions"

export const pubsub = new PubSub();

export const resolvers = {
	Query: {
		login,
		getUser,
		getUsers,
		getPost,
		getPosts,
		getPostsFollowings,
		getPostsUser,
		getPostsFilter,
		getTechnologies,
		getComments,
		getFollowers,
		getPostsSaved
	},
	Mutation: {
		postUser,
		putUser,
		deleteUser,
		postPost,
		putPost,
		deletePost,
		postComment,
		deleteComment,
		postRating,
		putRating,
		deleteRating,
		postFollower,
		deleteFollower,
		postPostSaved,
		deletePostSaved
	},
	Subscription: {
		newFollower,
		postCreated,
		postEdited,
		postDeleted,
		postCommented,
		postRated,
		postSaved
	}
}
