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

// LOGIN
export interface LoginClass extends UserBase {
	Setting: Setting
	token: string
}

export type Login = {
	login: LoginClass
}

export type Setting = {
	idSettings: string
	private: boolean
	n_ratings: boolean
	n_comments: boolean
	n_followers: boolean
	n_populates: boolean
	n_email_comments: boolean
	n_email_followers: boolean
	n_email_ratings: boolean
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
	createdAt: number
}

export interface DataPosts extends Omit<Posts, "comment" | "saved"> {}
export type DataPostSaved = {
	idPost: string
	idUser: string
	post: DataPosts
	user:	UserInfo
}

export type GetPosts = {
	getPosts: DataPosts[]
}

export type GetPostsUser = {
	getPostsUser: DataPosts[]
}

export type GetPostsSaved = {
	getPostsSaved: DataPostSaved[]
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

export interface PostPost extends Omit<Post, "comment" | "saved" | "stack"> {}

export type ResponsePostPost = {
	postPost: PostPost
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

export type CommentsWithData = {
	id: string
	idPost: string
	post: Post
	idUser: string
	user: UserInfo
	text:    string
	createdAt: string
}