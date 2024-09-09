import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($getCommentsId: String!) {
    getComments(id: $getCommentsId) {
      id
      idPost
      idUser
      user {
        id
        username
        avatar
      }
      text
      createdAt
    }
  }
`

export const POST_COMMENT = gql`
  mutation PostComment($idPost: String!, $idUser: String!, $text: String!) {
    postComment(idPost: $idPost, idUser: $idUser, text: $text) {
      id
      idPost
      idUser
      text
      createdAt
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation DeleteComment($deleteCommentId: String!) {
    deleteComment(id: $deleteCommentId) {
      id
    }
  }
`
