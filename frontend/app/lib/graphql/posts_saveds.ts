import { gql } from "@apollo/client";

export const GET_POSTS_SAVED = gql`
  query GetPostsSaved($idUser: String!, $cursor: String, $take: Int) {
    getPostsSaved(idUser: $idUser, cursor: $cursor, take: $take) {
      posts {
        idUser
        idPost
        user {
          id
          username
          avatar
        }
        post {
          id
        user {
          id
          username
          avatar
        }
        title
        description
        preview
        Stack {
          idPost
          idTechnology
          tech {
            id
            name
          }
        }
        comments
        saved
        rating
        isFollowing
        isSaved
        createdAt
        }
      }
      cursor
      hasMore
    }
  }
`

export const POST_POST_SAVED = gql`
  mutation PostPostSaved($idUser: String!, $idPost: String!) {
    postPostSaved(idUser: $idUser, idPost: $idPost) {
      idUser
      idPost
    }
  }
`

export const DELETE_POST_SAVED = gql`
  mutation DeletePostSaved($idUser: String!, $idPost: String!) {
    deletePostSaved(idUser: $idUser, idPost: $idPost) {
      id
    }
  }
`