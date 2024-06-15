export const typeDefs = `#graphql
   type Query {
      getUsers: [User],
      getUser(id: String!): User
      login(email: String!): UserWithSettings
   }

   type Mutation {
      postUser(username: String!, email: String!, password: String!): User
      putUser(id: String!, username: String, description: String, avatar: String): User
      deleteUser(id: String!): ResponseID
   }

   type User {
      id: String
      username: String
      email: String
      password: String
      description: String
      avatar: String
   }

   type Setting {
      idSettings: String
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
`
