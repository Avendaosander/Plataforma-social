import { gql } from "@apollo/client";

export const POST_RATING = gql`
  mutation PostRating($idPost: String!, $idUser: String!, $data: RatingInput!) {
    postRating(idPost: $idPost, idUser: $idUser, data: $data) {
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
  mutation PutRating($idPost: String!, $idUser: String!, $data: RatingInput!) {
    putRating(idPost: $idPost, idUser: $idUser, data: $data) {
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