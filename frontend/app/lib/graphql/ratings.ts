import { gql } from "@apollo/client";

export const POST_RATING = gql`
  mutation PostRating($idPost: String!, $idUser: String!, $rating: Float!) {
    postRating(idPost: $idPost, idUser: $idUser, rating: $rating) {
      idPost
      idUser
      rating
      user {
        id
        username
        avatar
      }
    }
  }
`

export const PUT_RATING = gql`
  mutation PutRating($idPost: String!, $idUser: String!, $rating: Float!) {
    putRating(idPost: $idPost, idUser: $idUser, rating: $rating) {
      idPost
      idUser
      rating
    }
  }
`

export const DELETE_RATING = gql`
  mutation DeleteRating($idPost: String!, $idUser: String!) {
    deleteRating(idPost: $idPost, idUser: $idUser) {
      idPost
      idUser
      rating
    }
  }
`