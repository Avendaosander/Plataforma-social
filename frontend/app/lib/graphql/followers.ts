import { gql } from "@apollo/client";

export const POST_FOLLOWER = gql`
  mutation PostFollower($idFollower: String!, $idFollowing: String!) {
    postFollower(idFollower: $idFollower, idFollowing: $idFollowing) {
      idFollower
      idFollowing
    }
  }
` 

export const GET_FOLLOWERS = gql`
  query GetFollowers($idFollower: String!) {
    getFollowers(idFollower: $idFollower) {
      idFollower
      idFollowing
    }
  }
` 

export const DELETE_FOLLOWER = gql`
  mutation DeleteFollower($idFollower: String!, $idFollowing: String!) {
    deleteFollower(idFollower: $idFollower, idFollowing: $idFollowing) {
      id
    }
  }
`