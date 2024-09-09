import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
      description
      avatar
      password
      Setting {
        idSetting
        private
        n_ratings
        n_comments
        n_followers
        n_populates
        n_email_comments
        n_email_followers
        n_email_ratings
      }
      token
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      username
      email  
      description
      avatar
      _count {
        followers
        following
        Post
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
      email
      description
      avatar
    }
  }
`

export const POST_USER = gql`
  mutation PostUser($username: String!, $email: String!, $password: String!) {
    postUser(username: $username, email: $email, password: $password) {
      id
      username
      email
      description
      avatar
    }
  }
`

export const PUT_USER = gql`
  mutation PutUser($id: String!, $username: String, $description: String, $avatar: String) {
    putUser(id: $id, username: $username, description: $description, avatar: $avatar) {
      id
      username
      email
      description
      avatar
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: String!) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`