import { gql } from "@apollo/client";

export const GET_POSTS_SAVED = gql`
  query GetPostsSaved($idUser: String!) {
    getPostsSaved(idUser: $idUser) {
      user {
        id
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
        saved
        _count {
          Post_saved
        }
        rating
        isFollowing
        isSaved
        createdAt
      }
      idUser
      idPost
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