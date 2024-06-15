import { gql } from "@apollo/client";


export const LOGIN = gql`
  query Login($email: String!) {
    login(email: $email) {
      id
      username
      email
      password
      description
      avatar
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
  mutation PutUser($putUserId: String!, $username: String, $description: String, $avatar: String) {
    putUser(id: $putUserId, username: $username, description: $description, avatar: $avatar) {
      id
      username
      email
      password
      description
      avatar
    }
  }
`