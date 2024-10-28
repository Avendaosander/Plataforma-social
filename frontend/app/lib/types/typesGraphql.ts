// GRAPHQL ERRORS
export interface GraphQLError {
	message: string
	locations?: { line: number; column: number }[]
	path?: string[]
	extensions?: Record<string, any>
}

export type NetworkError = Error | null

// Type for a response error from Apollo Client
export interface ApolloResponseError {
	graphQLErrors?: GraphQLError[]
	networkError?: NetworkError
	message: string
	extraInfo?: any
}

export type ResponseID = {
	id: string
}

// USER
export interface UserBase {
	id: string
	username: string
	email: string
	avatar: string
	description: string
	password: string
}

export interface GetUser extends Omit<UserBase, "password"> {}

export interface GetUserProfile extends Omit<UserBase, "password"> {
	_count: CountProfile
}

export type CountProfile = { 
	followers: number
	following: number
	Post: number
}

export type User = {
	data: DataUser
}

export type DataUser = {
	getUser: GetUser
}

export type DataUserProfile = {
	getUser: GetUserProfile
}

export type UserInfo = {
	id: string
	username: string
	avatar: string
}

export type GetUsers = {
	getUsers: GetUserProfile[]
}

// LOGIN
export interface LoginClass extends UserBase {
	token: string
}

export type Login = {
	login: LoginClass
}

export type Setting = {
	idSetting: string
	n_ratings: boolean
	n_comments: boolean
	n_followers: boolean
	n_populates: boolean
	n_new_post: boolean
	n_edit_post: boolean
	n_delete_post: boolean
	n_email_comments: boolean
	n_email_followers: boolean
	n_email_ratings: boolean
	n_email_new_post: boolean
	n_email_edit_post: boolean
	n_email_delete_post: boolean
}

export type ResponseLogin = {
	data: Login
	errors: GraphQLError[]
}

// REGISTER
export interface PostUser extends Omit<UserBase, "password"> {}
export type ResponseRegister = {
	postUser: PostUser
}

export type PostUserVariables = {
	email: string
	username: string
	password: string
}

// EDIT_USER
export interface PutUser extends Omit<UserBase, "password"> {}
export type ResponsePutUser = {
	putUser: PutUser
}

export type PutUserVariables = {
	id: string
	avatar?: string
	username?: string
	description?: string
}

// TECHNOLOGY
export type Technologies = {
	getTechnologies: GetTechnology[]
}

export type GetTechnology = {
	id: string
	name: string
}

// POSTS
export interface Posts {
	id: string
	user: UserInfo
	title: string
	description: string
	preview: string
	comments: number
	saved: number
	Stack: Stack[]
	isSaved: boolean
	rating: number
	isFollowing: boolean
	createdAt: number
}

export interface DataPosts extends Omit<Posts, "comment"> {}

export interface DataPostsPopulate extends Omit<Posts, "comment"> {
	totalRating: number
}

export type DataPostSaved = {
	idPost: string
	idUser: string
	post: DataPosts
	user:	UserInfo
}

export type PostSaved = {
	idPost: string
	idUser: string
}

export type GetPosts = {
	getPosts: PaginationData
}

export type GetPostsPopulate = {
	getPostsPopulate: PaginationData
}

export type PaginationData = {
	posts: DataPosts[],
	cursor: string
	hasMore: boolean
}

export type PaginationDataPopulate = {
	posts: DataPostsPopulate[],
	cursor: string
	hasMore: boolean
}

export type PaginationPostsSaved = {
	posts: DataPostSaved[],
	cursor: string
	hasMore: boolean
}

export type GetPostsFollowings = {
	getPostsFollowings: PaginationData
}

export type GetPostsFilter = {
	getPostsFilter: PaginationData
}

export type GetPostsUser = {
	getPostsUser: PaginationData
}

export type GetPostsSaved = {
	getPostsSaved: PaginationPostsSaved
}

export type postPostSaved = {
	postPostSaved: PostSaved[]
}

export type deletePostSaved = {
	deletePostSaved: PostSaved[]
}

export type PostSavedInput = {
	idPost: string
	idUser: string
}

export type Stack = {
	idTechnology: string;
	tech:         Tech;
}

export type Tech = {
	id:   string;
	name: string;
}

export type PostPostVariables = {
	title: string
	description: string
	technologies: GetTechnology[]
	newTechnologies?: NewTechnology[]
}

export type PutPostVariables = {
	putPostId: string
	title?: string
	description?: string
	technologies?: GetTechnology[]
	newTechnologies?: NewTechnology[]
	filesDelete?: File[]
}

export interface PostPost extends Omit<Post, "comment" | "saved" | "stack"> {}

export type ResponsePostPost = {
	postPost: PostPost
}

export type PutPost = {
	putPost: Post
}

export type NewTechnology = {
	name: string
}

export type GetPost = {
	data: DataPost;
}

export type DataPost = {
	getPost: Post;
}

export type Post = {
	id:          string;
	user:        UserInfo;
	title:       string;
	description: string;
	preview:     string;
	Comment:     CommentsWithData[];
	Stack:       StackSummary[];
	saved:       null;
	createdAt:   number;
	_count:      CountPost;
	isSaved: 		 boolean
	rating: 		 number
	myRating:		 Rating
	File:				 File[]
}

export type File = {
	id: string,
	idPost: string
	file: string
}

export type StackSummary = {
	idPost:       string;
	idTechnology: string;
	tech:         Tech;
}

export type CountPost = {
	Rating: number;
	Post_saved: number;
}

export type PostFollower = {
	postFollower: Follower;
}

export type DeleteFollower = {
	deleteFollower: Follower;
}

export type Follower = {
	idFollower:  string;
	idFollowing: string;
}

export type GetFollower = {
	getFollowers: Follower[];
}

export type Comment = {
	id:        string;
	idPost:    string;
	idUser:    string;
	text:      string;
	createdAt: string;
}

export type CommentInput = {
	idPost:    string;
	idUser:    string;
	text:      string;
}

export type PostComment = {
	postComment: CommentsWithData
}

export type CommentsWithData = {
	id: string
	idPost: string
	post: Post
	idUser: string
	user: UserInfo
	text:    string
	createdAt: string
}

export type PostRating = {
	postRating: Rating
}

export type PutRating = {
	putRating: Rating
}

export type DeleteRating = {
	deleteRating: Rating
}

export type Rating = {
	idPost: string
	idUser: string
	rating: number
}

export type RatingInputDelete = {
	idPost: string
	idUser: string
}


// NOTIFICATIONS

export type GetNotifications = {
	getNotifications: Notifications;
}

export type Notification = {
	id:        	string;
	idUser:    	string;
	user:			 	UserBase
	idUserSend:	string;
	userSend:	 	UserBase
	avatar:    	string;
	message:   	string;
	link:      	string;
	read:      	boolean;
	createdAt: 	string;
}

export type Notifications = {
	notifications: Notification[]
	unread: number
	cursor: string
	hasMore: boolean
}

export type PutNotification = {
	putNotification: ResponseID
}

export type PutNotificationVariables = {
	putNotificationId: string
	read: boolean
}

export type DeleteNotification = {
	deleteNotification: ResponseID
}
	
export type DeleteNotificationVariables = {
	deleteNotificationId: string
}

export type GetSetting = {
	getSettings: Setting
}

export type PutSetting = {
	putSettings: Setting
}

export type PutSettingVariable = {
	data: {
		idSetting: string
		n_ratings?: boolean
		n_comments?: boolean
		n_followers?: boolean
		n_populates?: boolean
		n_new_post?: boolean
		n_edit_post?: boolean
		n_delete_post?: boolean
		n_email_comments?: boolean
		n_email_followers?: boolean
		n_email_ratings?: boolean
		n_email_new_post?: boolean
		n_email_edit_post?: boolean
		n_email_delete_post?: boolean
	}
}

export type ResponseOK = {
	response: string
}

export type SendEmailCode = {
	sendRecoveryCode: ResponseOK 
}

export type VerifyCode = {
	verifyCode: ResponseOK 
}

export type VerifyCodeVariables = {
	email: string
	code: string
}

export type ResetPassword = {
	changePassword: ResponseOK 
}

export type ResetPasswordVariables = {
	email: string
	password: string
}