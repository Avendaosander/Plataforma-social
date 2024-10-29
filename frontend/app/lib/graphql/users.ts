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
  query GetUsers($filter: PostFilterInput!, $cursor: String, $take: Int) {
    getUsers(filter: $filter, cursor: $cursor, take: $take) {
      users {
        id
        username
        email
        password
        description
        avatar
        _count {
          following
          Post
        }
      }
      cursor
      hasMore
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