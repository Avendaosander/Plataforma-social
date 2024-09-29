export const typeDefs = `#graphql
   type Query {
      login(email: String!, password: String!): LoginResponse
      getUser(id: String!): UserProfile
      getUsers: [UserProfile]
      getPost(id: String!): Post
      getPosts(cursor: String, take: Int): GetPosts
      getPostsFollowings: [PostSummary]
      getPostsUser(idUser: String!): [PostSummary!]
      getPostsFilter(filter: PostFilterInput!): [PostSummary!]!
      getTechnologies: [Technology]
      getComments(id: String!): [CommentsWithData]
      getFollowers(idFollower: String!): [Follower]
      getPostsSaved(idUser: String!): [Post_saved]
   }

   type Mutation {
      postUser(username: String!, email: String!, password: String!): User
      putUser(id: String!, username: String, description: String, avatar: String): User
      deleteUser(id: String!): ResponseID
      postPost(title: String!, description: String!, technologies: [TechnologyInput]!, newTechnologies: [NewTechnology]): Post
      putPost(id: String!, title: String, description: String, technologies: [TechnologyInput]!, newTechnologies: [NewTechnology], filesDelete: [FilesDelete]): Post
      deletePost(id: String!): ResponseID
      postComment(idPost: String!, idUser: String!, text: String!): CommentsWithData
      deleteComment(id: String!): ResponseID
      postRating(idPost: String!, idUser: String!, rating: Float!): Rating!
      putRating(idPost: String!, idUser: String!, rating: Float!): Rating!
      deleteRating(idPost: String!, idUser: String!): Rating!
      postFollower(idFollower: String!, idFollowing: String!): FollowerResponse
      deleteFollower(idFollower: String!, idFollowing: String!): ResponseID
      postPostSaved(idUser: String!, idPost: String!): Post_savedResponse
      deletePostSaved(idUser: String!, idPost: String!): ResponseID
   }

   type Subscription {
      newFollower: SubscriptionResponse
      postCreated: SubscriptionResponse
      postEdited: SubscriptionResponse
      postDeleted: SubscriptionResponse
      postCommented: SubscriptionResponse
      postRated: SubscriptionResponse
      postSaved: SubscriptionResponse
   }

   type SubscriptionResponse {
      id: String
      text: String
      link: String
   }
   # USERS
   type User {
      id: String
      username: String
      email: String
      password: String
      description: String
      avatar: String
   }

   type UserProfile {
      id: String
      username: String
      email: String
      password: String
      description: String
      avatar: String
      _count: CountProfile
   }

   type CountProfile {
      followers: Int
      following: Int
      Post: Int
   }

   type UserInfo {
      id: String
      username: String
      avatar: String
   }
   
   type LoginResponse {
      id: String
      username: String
      email: String
      password: String
      description: String
      avatar: String
      Setting: Setting
      token: String
   }
   type UserWithSettings {
      id: String
      username: String
      email: String
      password: String
      description: String
      avatar: String
      Setting: Setting
   }

   type ResponseID {
      id: String
   }
   
   #SETTINGS
   type Setting {
      idSetting: String
      idUser: String
      private: Boolean
      n_ratings: Boolean
      n_comments: Boolean
      n_followers: Boolean
      n_populates: Boolean
      n_email_ratings: Boolean
      n_email_comments: Boolean
      n_email_followers: Boolean
   }

   # POSTS
   type Post {
      id: String
      user: UserInfo
      title: String
      description: String
      preview: String
      File: [File]
      Comment: [CommentsWithData]
      Stack: [Stack]
      saved: Int
      _count: Count
      rating: Float
      isFollowing: Boolean
      isSaved: Boolean
      myRating: RatingSummary
      createdAt: String
   }

   type GetPosts {
      posts: [PostSummary]
      cursor: String
   }

   type PostSummary {
      id: String
      user: UserInfo
      title: String
      description: String
      preview: String
      Stack: [Stack]
      comments: Int
      saved: Int
      rating: Float
      isFollowing: Boolean
      isSaved: Boolean
      createdAt: String
   }

   input PostFilterInput {
      user: String
      title: String
      technology: String
      rating: Float
   }

   # COMMENTS
   type Comment {
      id: String
      idPost: String
      idUser: String
      text:    String
      createdAt: String
   }

   type CommentsWithData {
      id: String
      idPost: String
      post: Post
      idUser: String
      user: UserInfo
      text:    String
      createdAt: String
   }

   # TECHNOLOGYS
   type Stack {
      idPost: String
      post: Post
      idTechnology: String
      tech: Technology
   }
   type Technology {
      id:   String
      name: String
   }

   input TechnologyInput {
      id:   String
      name: String
   }
   
   input NewTechnology {
	   name: String
   }

   #RATINGS
   type Rating {
      idPost: String
      idUser: String
      rating: Float
      post: Post
      user: User
   }

   type RatingSummary {
      idPost: String
      idUser: String
      rating: Float
   }

   input RatingInput {
      idPost: String
      idUser: String
      rating: Float
   }

   # FILES
   type File {
      id: String
      idPost: String
      file: String
   }

   input FilesDelete {
      id: String
      idPost: String
      file: String
   }

   type Count {
      Rating: Int
      Post_saved: Int
   }

   #FOLOWERS
   type Follower {
      follower: User
      following: User
      idFollower: String
      idFollowing: String
   }

   type FollowerResponse {
      idFollower: String!
      idFollowing: String!
   }

   #POSTS_SAVED
   type Post_saved {
      user: User
      post: Post
      idUser: String
      idPost: String
   }

   type Post_savedResponse {
      idUser: String!
      idPost: String!
   }
`
