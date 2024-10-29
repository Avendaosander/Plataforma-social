export const typeDefs = `#graphql
   type Query {
      login(email: String!, password: String!): LoginResponse
      getUser(id: String!): UserProfile
      getUsers(filter: PostFilterInput!, cursor: String, take: Int): GetUsersFilter
      getPost(id: String!): Post
      getPosts(cursor: String, take: Int): GetPosts
      getPostsPopulate(cursor: String, take: Int): GetPostsPopulate
      getPostsFollowings(cursor: String, take: Int): GetPostsFollowings
      getPostsUser(idUser: String!, cursor: String, take: Int): GetPostsUser
      getPostsFilter(filter: PostFilterInput!, cursor: String, take: Int): GetPostsFilter
      getTechnologies: [Technology]
      getComments(id: String!): [CommentsWithData]
      getFollowers(idFollower: String!): [Follower]
      getPostsSaved(idUser: String!, cursor: String, take: Int): GetPostsSaved
      getNotifications(idUser: String!, cursor: String, take: Int): Notifications
      getSettings(idUser: String!): Setting
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
      postFollower(idFollower: String!, idFollowing: String!): Follower
      deleteFollower(idFollower: String!, idFollowing: String!): ResponseID
      postPostSaved(idUser: String!, idPost: String!): Post_savedResponse
      deletePostSaved(idUser: String!, idPost: String!): ResponseID
      putNotification(id: String!, read: Boolean!): ResponseID
      deleteNotification(id: String!): ResponseID
      putSettings(data: SettingInput): Setting
      sendRecoveryCode(email: String!): ResponseOK
      verifyCode(email: String!, code: String!): ResponseOK
      changePassword(email: String!, password: String!): ResponseOK
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

   type GetUsersFilter {
      users: [UserProfile]
      cursor: String
      hasMore: Boolean
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

   type ResponseOK {
      response: String
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
      n_new_post: Boolean
      n_edit_post: Boolean
      n_delete_post: Boolean
      n_email_ratings: Boolean
      n_email_comments: Boolean
      n_email_followers: Boolean
      n_email_new_post: Boolean
      n_email_edit_post: Boolean
      n_email_delete_post: Boolean
   }

   input SettingInput {
      idSetting: String
      idUser: String
      n_ratings: Boolean
      n_comments: Boolean
      n_followers: Boolean
      n_populates: Boolean
      n_new_post: Boolean
      n_edit_post: Boolean
      n_delete_post: Boolean
      n_email_ratings: Boolean
      n_email_comments: Boolean
      n_email_followers: Boolean
      n_email_new_post: Boolean
      n_email_edit_post: Boolean
      n_email_delete_post: Boolean
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
      hasMore: Boolean
   }

   type GetPostsPopulate {
      posts: [PostSummaryPopulate]
      cursor: String
      hasMore: Boolean
   }

   type GetPostsFollowings {
      posts: [PostSummary]
      cursor: String
      hasMore: Boolean
   }

   type GetPostsFilter {
      posts: [PostSummary]
      cursor: String
      hasMore: Boolean
   }

   type GetPostsUser {
      posts: [PostSummary]
      cursor: String
      hasMore: Boolean
   }

   type GetPostsSaved {
      posts: [Post_saved]
      cursor: String
      hasMore: Boolean
   }

   type PostSummaryPopulate {
      id: String
      user: UserInfo
      title: String
      description: String
      preview: String
      Stack: [Stack]
      comments: Int
      saved: Int
      rating: Float
      totalRating: Float
      isFollowing: Boolean
      isSaved: Boolean
      createdAt: String
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
      post: PostSummary
      idUser: String
      idPost: String
   }

   type Post_savedResponse {
      idUser: String!
      idPost: String!
   }

   type Notification {
      id: String
      idUser: String
      user: User
      idUserSend: String
      userSend: User
      message: String
      link: String
      read: Boolean
      createdAt: String 
   }

   type Notifications {
      notifications: [Notification]
      unread: Int
      cursor: String
      hasMore: Boolean
   }
`
