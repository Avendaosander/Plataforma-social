import { deleteUser, getUser, getUsers, login, postUser, putUser } from "./users.js"
import { deleteFollower, getFollowers, postFollower } from "./followers.js"
import { deletePost, getPost, getPosts, getPostsFilter, getPostsFollowings, getPostsPopulate, getPostsUser, postPost, putPost } from "./posts.js"
import { getTechnologies } from "./technologhy.js"
import { deleteComment, getComments, postComment } from "./comments.js"
import { deleteRating, postRating, putRating } from "./ratings.js"
import { deletePostSaved, getPostsSaved, postPostSaved } from "./post_saved.js"
import { PubSub } from "graphql-subscriptions"
import { deleteNotification, getNotifications, putNotification } from "./notifications.js"
import { getSettings, putSettings } from "./settings.js"
import { changePassword, sendRecoveryCode, verifyCode } from "./recovery.js"

export const pubsub = new PubSub();

export const resolvers = {
	Query: {
		login,
		getUser,
		getUsers,
		getPost,
		getPosts,
		getPostsFollowings,
		getPostsPopulate,
		getPostsUser,
		getPostsFilter,
		getTechnologies,
		getComments,
		getFollowers,
		getPostsSaved,
		getNotifications,
		getSettings
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
		deletePostSaved,
		putNotification,
		deleteNotification,
		putSettings,
		sendRecoveryCode,
		verifyCode,
		changePassword
	}
}
