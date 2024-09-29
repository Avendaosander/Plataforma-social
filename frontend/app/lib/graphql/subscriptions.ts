import { gql } from "@apollo/client";

export const NEW_FOLLOWER = gql`
  subscription NewFollower {
    newFollower {
      id
      text
      link
    }
  }
`